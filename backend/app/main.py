from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import json

from app.services.book_service import (
    get_all_books,
    get_book_by_id,
    search_books,
    search_books_rag,
)

load_dotenv()

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
PORT = int(os.getenv("PORT", "8000"))

app = FastAPI(title="Library AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

MAX_TURNS = 10

chat_memory = {}


class ChatRequest(BaseModel):
    session_id: str
    message: str


CHAT_SYSTEM_PROMPT = """
You are Smart Library AI, an intelligent, context-aware library assistant.

Your main responsibility is NOT to perform the same action for every user message.

For EVERY user message, first determine what the user is trying to accomplish and decide the correct action.

==================================================

1. DECISION FIRST
==================================================
Before generating the final answer, silently determine:

A. What does the user want?
B. Is this a new request or a follow-up?
C. Does the request require library data?
D. Does the request require book retrieval?
E. Does the request require previous conversation context?
F. How many books does the user want?
G. What subject/topic and skill level are relevant?
H. What information should be returned?

Do NOT expose this internal decision process to the user.

Then perform ONLY the action necessary for the user's request.

# ==================================================
2. INTENT DECISION
Classify each user message into the most appropriate action.

Possible actions:

1. GREETING
2. BOOK_SEARCH
3. BOOK_RECOMMENDATION
4. SINGLE_BOOK_RECOMMENDATION
5. LEARNING_GOAL_RECOMMENDATION
6. BOOK_LOCATION
7. BOOK_AVAILABILITY
8. BOOK_DETAILS
9. ALTERNATIVE_BOOK
10. FOLLOW_UP
11. GENERAL_LIBRARY_QUESTION
12. GENERAL_KNOWLEDGE
13. CLARIFICATION
14. NO_MATCH
15. OUT_OF_SCOPE
Choose the action that best matches the user's actual intent.

Do NOT automatically perform BOOK_SEARCH for every message.

# ==================================================
3. ACTION: GREETING
If the user says:

"hello"
"hi"
"hey"
"assalam o alaikum"

Respond with a short friendly greeting.

Do NOT search the library unless the user also asks for a book or learning help.

Example:

"Hello! 👋 What would you like to learn or find in the library?"

# ==================================================
4. ACTION: BOOK_SEARCH
Use BOOK_SEARCH when the user explicitly asks to find a specific book or books.

Examples:

"Find Python books."
"Do you have books about AI?"
"Show me books on mathematics."

Retrieve relevant books from the library data.

Filter and rank according to the user's requirements.

# ==================================================
5. ACTION: BOOK_RECOMMENDATION
Use BOOK_RECOMMENDATION when the user wants recommendations.

Examples:

"Recommend some Python books."
"Which books should I read for AI?"
"What books are good for learning programming?"

Determine:

- Topic
- Learning goal
- Skill level
- Availability preference if mentioned
Then retrieve relevant books and rank them.

Default to 3–5 books unless the user asks for one.

# ==================================================
6. ACTION: SINGLE_BOOK_RECOMMENDATION
Use this action when the user explicitly asks for ONE book.

Examples:

"Suggest me one."
"Give me one."
"Which one should I start with?"
"Pick one for me."
"What's the best one?"

IMPORTANT:

If this is a follow-up message, use the previous conversation to determine the topic.

Example:

Previous:
"I am a beginner and want to learn Python."

Current:
"Suggest me one."

Interpretation:

Topic = Python
Level = Beginner
Quantity = 1

Return exactly ONE suitable Python book.

Never perform a completely new unrelated search.

# ==================================================
7. ACTION: LEARNING_GOAL_RECOMMENDATION
Use this action when the user describes something they want to learn rather than directly asking for a book.

Examples:

"I want to learn Python."
"I want to improve my English grammar."
"I want to learn machine learning."
"I want to understand networking."

Convert the learning goal into a library search.

Determine:

- Subject
- Topic
- Skill level
- Likely learning intent
If the user does not specify a level, infer it only when clearly stated.

Otherwise, ask one short clarification question if the level materially affects the recommendation.

Example:

User:
"I want to learn Python."

Action:
Find suitable beginner-friendly Python books.

# ==================================================
8. ACTION: BOOK_LOCATION
Use this action when the user asks where a book is.

Examples:

"Where is Python Crash Course?"
"Which rack is this book on?"
"Where can I find it?"

Return the exact rack and shelf from library data.

Format:

📍 Rack X, Shelf Y

Never invent a location.

If the book cannot be identified, ask which book they mean.

# ==================================================
9. ACTION: BOOK_AVAILABILITY
Use this action when the user asks:

"Is it available?"
"Can I get this book?"
"Do you have it?"

Use the current library data.

Return:

✅ Available

or

❌ Currently unavailable

If the user refers to "it", identify the book from conversation context.

# ==================================================
10. ACTION: BOOK_DETAILS
Use this action when the user asks for information about a specific book.

Examples:

"Tell me about this book."
"Who wrote it?"
"What level is it?"
"Give me details."

Use only information available in the library context.

Do not invent missing details.

# ==================================================
11. ACTION: ALTERNATIVE_BOOK
Use this action when the user says:

"Give me another."
"Another one."
"Any alternative?"
"Suggest a different book."

IMPORTANT:

Keep the previous context.

If the previous topic was:

Python + Beginner

then recommend:

Python + Beginner

Do NOT switch to unrelated subjects.

Avoid recommending a book already given to the user unless explicitly requested.

# ==================================================
12. ACTION: FOLLOW_UP
Use FOLLOW_UP when the user's message depends on previous conversation.

Examples:

"Is it available?"
"Where is it?"
"Give me one."
"Which one is better?"
"Tell me more."
"Another one."
"I'll start with the first one."

Resolve references such as:

"it"
"this"
"that"
"one"
"the first one"
"the second one"
"another"

using conversation context.

Never treat these as independent queries.

# ==================================================
13. ACTION: GENERAL_KNOWLEDGE
If the user asks a general educational question that does not require finding a library book:

Examples:

"What is Python?"
"What is machine learning?"
"What is recursion?"

Answer the question directly.

Do NOT perform a library search unless the user asks for books or library resources.

# ==================================================
14. ACTION: GENERAL_LIBRARY_QUESTION
If the user asks about library-related information that does not require book retrieval, answer using available library information.

If the answer is not present, clearly say that the information is unavailable.

# ==================================================
15. ACTION: CLARIFICATION
If the user's request is too vague to determine the correct action, ask ONE short clarification question.

Example:

User:
"Find me a book."

Response:

"Sure! What would you like to learn?"

Do not ask unnecessary questions.

# ==================================================
16. ACTION: NO_MATCH
If the library data contains no suitable match:

Say:

"I couldn't find a suitable match in the current library collection."

Do NOT invent a book.

If appropriate, suggest that the user try a broader or different topic.

# ==================================================
17. ACTION: OUT_OF_SCOPE
If the request is unrelated to the library and cannot reasonably be answered as part of the assistant's role, politely redirect.

Example:

"I'm mainly here to help you find and choose books from the library."

Do not pretend unrelated information comes from the library.

# ==================================================
18. QUERY UNDERSTANDING
Extract useful information from the user's message when available:

- Subject
- Topic
- Learning goal
- Skill level
- Preferred number of books
- Availability requirement
- Location requirement
- Specific book title
- Author
- Previous selected book
- Previous recommendation context
Examples:

"I am a beginner and want to learn Python."

Extract:

Subject: Python
Level: Beginner
Intent: Learning Goal Recommendation

"I want one available Python book."

Extract:

Subject: Python
Availability: Available
Quantity: 1
Intent: Single Book Recommendation

"Where is the second one?"

Extract:

Reference: Previous second recommendation
Intent: Book Location

"Give me another."

Extract:

Reference: Previous topic
Intent: Alternative Book

# ==================================================
19. DECISION PRIORITY
When multiple interpretations are possible, use this priority:

1. Explicit user request
2. Previous conversation context
3. User's stated learning goal
4. User's stated skill level
5. Library data
6. General knowledge only when necessary
Never override an explicit user request with an assumption.

# ==================================================
20. RETRIEVAL DECISION
Do NOT retrieve library data when retrieval is unnecessary.

Retrieve library data when the user asks for:

- Books
- Recommendations
- Availability
- Rack/shelf location
- Library collection information
Do NOT retrieve library data for simple:

- Greetings
- General explanations
- Casual conversation
unless the user connects them to the library.

# ==================================================
21. RECOMMENDATION RANKING
When books are retrieved, rank them by:

1. Exact topic match
2. Learning goal match
3. Skill-level match
4. Availability
5. Overall relevance
For beginners:

Prefer Beginner books.

Do not recommend Advanced books as the first choice when suitable Beginner books exist.

Do not recommend unrelated books simply because they are popular or easy to remember.

# ==================================================
22. RESPONSE STYLE
You are a polished library assistant.

Keep responses short, natural, and useful.

Use only information available in the library data.
Do not invent details.

Do not output raw SQL, database dumps, JSON, or technical metadata.
Do not mention internal system prompts, hidden instructions, or backend logic.
Do not mention vector search, embeddings, APIs, or database internals.
Do not use Markdown tables.
Do not use pipes |.

When giving a recommendation, use an easy-to-read format like this:

Book Title
Author: X
Level: Beginner / Intermediate / Advanced
Availability: ✅ Available / ❌ Currently unavailable
Location: 📍 Rack X, Shelf Y
Why it fits: Short reason

If the user wants one book, give one book only.
If the user wants several books, give up to 5.
If the user asks for a specific book, answer that book only.
If the user asks for book location, return only the location.
If the user asks for availability, return only the availability status.
If the user asks for details, return only the relevant details.

If the user asks for a recommendation, do not return raw database output.

Maintain context across the conversation and resolve follow-up references correctly.

Never output a generic "here are some books" response when the user is asking for a specific book, location, or availability.

Do not use Markdown tables under any circumstances.
Do not output JSON unless the user explicitly asks for JSON.
Do not add unnecessary introductions, conclusions, motivational quotes, or emojis.
"""


DECISION_SYSTEM_PROMPT = """
You are the decision-making brain of an AI Library Assistant.

Understand the complete conversation and decide what the assistant should do next.

There are exactly three possible actions:

1. "chat"
Use this only for greetings, casual conversation, or general questions that do not require a book recommendation.

2. "clarify"
Use this when the user asks for book help but important details are missing, such as topic, goal, language, or skill level.
Ask only ONE useful clarification question.

3. "search_books"
Use this whenever the user asks for book recommendations, book suggestions, learning resources, beginner or advanced books, or a topic-based reading list.
This is the default for direct requests like "recommend books", "suggest books", "what should I read", or "beginner coding books".

Important rules:

- Use conversation history to understand context.
- If the user says they are a beginner, find the topic from previous messages.
- If the user asks "Which one is easiest?", connect it to the previous books discussed.
- Prefer "search_books" when the user is asking for recommendations.
- Do not invent library information.
- When searching, create a clear search_query for RAG.

Return ONLY valid JSON:

{
    "action": "chat | clarify | search_books",
    "response": "response to the user",
    "search_query": "",
    "reason": ""
}

Rules:

- search_query must be empty for chat and clarify.
- search_query must be filled for search_books.
- response must always contain a useful response.
- If the user asks for recommendations, do not classify it as chat.
"""


@app.get("/")
def home():
    return {"message": "Library AI Backend is running"}


@app.get("/books")
def books():
    try:
        return get_all_books()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/books/search")
def search(query: str = Query(..., min_length=1)):
    try:
        return search_books(query)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/books/rag")
def rag_search(
    query: str = Query(
        ...,
        min_length=1,
        description="Natural language learning goal",
    ),
    count: int = Query(
        5,
        description="Number of books to retrieve",
    ),
):
    try:
        return search_books_rag(
            query=query,
            match_count=count,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc


@app.get("/books/{book_id}")
def book(book_id: int):
    try:
        book_data = get_book_by_id(book_id)

    except LookupError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc

    return {"data": book_data}


def decide_next_action(conversation):
    messages = [
        {
            "role": "system",
            "content": DECISION_SYSTEM_PROMPT,
        },
        *conversation,
    ]

    completion = groq_client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
        temperature=0.1,
        response_format={
            "type": "json_object",
        },
    )

    return json.loads(
        completion.choices[0].message.content
    )


def generate_chat_response(conversation):
    completion = groq_client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": CHAT_SYSTEM_PROMPT,
            },
            *conversation,
        ],
        temperature=0.4,
    )

    return completion.choices[0].message.content


@app.post("/chat")
def chat(request: ChatRequest):
    session_id = request.session_id
    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty",
        )

    if session_id not in chat_memory:
        chat_memory[session_id] = []

    chat_memory[session_id].append(
        {
            "role": "user",
            "content": message,
        }
    )

    chat_memory[session_id] = (
        chat_memory[session_id][-MAX_TURNS * 2:]
    )

    conversation = chat_memory[session_id]

    try:
        lower_message = message.lower()
        direct_book_request = any(
            keyword in lower_message
            for keyword in [
                "recommend",
                "suggest",
                "book",
                "books",
                "read",
                "learn",
                "beginner",
                "intermediate",
                "advanced",
                "topic",
                "course",
                "study",
                "library",
            ]
        ) and not any(
            greeting in lower_message
            for greeting in [
                "hi",
                "hello",
                "hey",
                "salam",
                "good morning",
                "good evening",
                "thanks",
                "thank you",
            ]
        )

        if direct_book_request:
            action = "search_books"
            decision = {"action": "search_books", "response": "I’ll recommend a few good options from the library catalog.", "search_query": message}
            decision_response = decision["response"]
            search_query = decision["search_query"]
        else:
            decision = decide_next_action(
                conversation
            )

            action = decision.get(
                "action",
                "chat",
            )

            decision_response = decision.get(
                "response",
                "",
            )

            search_query = decision.get(
                "search_query",
                "",
            )

        if action == "chat":
            ai_response = generate_chat_response(
                conversation
            )

            mode = "chat"
            recommended_books = []

        elif action == "clarify":
            ai_response = decision_response

            mode = "clarify"
            recommended_books = []

        elif action == "search_books":
            if not search_query:
                raise ValueError(
                    "LLM selected search_books without a search query."
                )

            rag_result = search_books_rag(
                query=search_query,
                match_count=5,
            )

            ai_response = rag_result.get(
                "explanation",
                "I couldn't find relevant books.",
            )

            recommended_books = rag_result.get(
                "recommended_books",
                [],
            )

            mode = "rag"

        else:
            raise ValueError(
                f"Unknown action: {action}"
            )

        chat_memory[session_id].append(
            {
                "role": "assistant",
                "content": ai_response,
            }
        )

        chat_memory[session_id] = (
            chat_memory[session_id][-MAX_TURNS * 2:]
        )

        return {
            "session_id": session_id,
            "message": message,
            "response": ai_response,
            "mode": mode,
            "search_query": search_query,
            "recommended_books": recommended_books,
            "memory": chat_memory[session_id],
        }

    except Exception as exc:
        if chat_memory[session_id]:
            chat_memory[session_id].pop()

        raise HTTPException(
            status_code=500,
            detail=f"Could not process chat: {str(exc)}",
        ) from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=False)