import json
import os
import requests
from groq import Groq
from app.supabase_client import supabase

# Initialize Groq client
groq_client = None
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
HF_API_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction"

def get_groq_client():
    global groq_client
    if groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return None
        groq_client = Groq(api_key=api_key)
    return groq_client


def get_embedding_from_huggingface(text: str):
    """Get embeddings from Hugging Face API instead of local model"""
    if not HUGGINGFACE_API_KEY:
        return None
    
    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
    
    try:
        response = requests.post(
            HF_API_URL,
            json={"inputs": text},
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"HF API Error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Error calling Hugging Face API: {e}")
        return None


# Minimum similarity threshold to filter out off-topic matches (30%)
SIMILARITY_THRESHOLD = 0.30

# Fallback models list for Groq completions
candidate_models = [
    "openai/gpt-oss-20b",
    "qwen/qwen3-32b",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "groq/compound-mini",
]


def generate_llm_response(prompt: str, system_message: str = "You are a helpful library assistant AI.") -> str:
    """Helper function to execute Groq completion across fallback models."""
    client = get_groq_client()
    if client is None:
        return "I can help you find beginner-friendly coding books. Tell me your topic or skill level and I'll recommend a few good options."

    for model_name in candidate_models:
        try:
            completion = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
            )
            res = completion.choices[0].message.content
            if res:
                cleaned = res.strip()
                if len(cleaned) > 500:
                    cleaned = cleaned[:450].rsplit(" ", 1)[0] + "..."
                return cleaned
        except Exception:
            continue
    return "I can help you find beginner-friendly coding books. Tell me your topic or skill level and I'll recommend a few good options."


def process_user_intent(query: str) -> dict:
    """Detects user intent (Greeting vs Search) and translates Roman Urdu to standard English."""
    prompt = f"""Analyze the following user input for a library chatbot:
"{query}"

Perform two tasks:
1. Classify INTENT as 'GREETING' (for hi, hello, salam, general pleasantries) or 'BOOK_SEARCH' (for learning goals, course topics, book inquiries).
2. If INTENT is 'BOOK_SEARCH', translate any Roman Urdu or informal phrasing into concise standard English search terms. If already in English, return it unchanged.

Return strictly valid JSON format with keys 'intent' and 'search_term'."""

    client = get_groq_client()
    if client is None:
        return {"intent": "BOOK_SEARCH", "search_term": query}

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            response_format={"type": "json_object"},
        )
        return json.loads(completion.choices[0].message.content)
    except Exception:
        return {"intent": "BOOK_SEARCH", "search_term": query}


def get_all_books():
    response = supabase.table("books").select("*").execute()
    return response.data


def get_book_by_id(book_id: int):
    response = supabase.table("books").select("*").eq("id", book_id).execute()
    if not response.data:
        raise LookupError(f"Book with ID {book_id} not found")
    return response.data[0]


def search_books(query: str):
    response = supabase.table("books").select("*").ilike("title", f"%{query}%").execute()
    return response.data


def search_books_rag(query: str, match_count: int = 5):
    # 1. Process user intent and perform Roman Urdu translation in one LLM pass
    processed = process_user_intent(query)
    intent = str(processed.get("intent", "BOOK_SEARCH")).upper()
    search_term = processed.get("search_term", query)

    # 2. Handle simple greetings without executing database vector search
    if "GREETING" in intent:
        greeting_prompt = f"The user said: '{query}'. Respond warmly as an AI Library Assistant, welcome them, and ask what book or course topic they are looking for."
        explanation = generate_llm_response(greeting_prompt, "You are a friendly and helpful library assistant AI.")
        return {
            "query": query,
            "explanation": explanation,
            "recommended_books": [],
        }

    # 3. Convert translated English search term into vector embedding using Hugging Face API
    query_embedding = get_embedding_from_huggingface(search_term)
    
    if query_embedding is None:
        return {
            "query": query,
            "explanation": "The semantic search service is temporarily unavailable. Please try again in a moment.",
            "recommended_books": [],
        }

    # 4. Search Supabase using vector RPC function
    rpc_response = supabase.rpc(
        "match_library_books",
        {
            "query_embedding": query_embedding,
            "match_count": match_count,
        }
    ).execute()

    raw_books = rpc_response.data or []

    # 5. Filter out books below the 30% similarity threshold
    recommended_books = [
        book for book in raw_books
        if book.get("similarity", 0.0) >= SIMILARITY_THRESHOLD
    ]

    # Handle off-topic queries or topics not available in catalog
    if not recommended_books:
        return {
            "query": query,
            "explanation": "I couldn't find any relevant books matching your request in our catalog. Please try searching for an academic or technical topic.",
            "recommended_books": [],
        }

    def format_book_block(book):
        meta = book.get("metadata", {}) or {}
        title = book.get("title") or meta.get("title") or "Untitled"
        author = book.get("author") or meta.get("author") or "Unknown author"
        level = meta.get("level") or book.get("level") or "Not specified"
        rack = book.get("rack") or meta.get("rack")
        shelf = book.get("shelf") or meta.get("shelf")
        availability = book.get("availability")
        if availability is None:
            availability = meta.get("availability")

        if str(availability).lower() in {"yes", "true", "available", "available now"}:
            availability_text = "✅ Available"
        else:
            availability_text = "❌ Currently unavailable"

        if rack is not None and shelf is not None:
            location_text = f"📍 Rack {rack}, Shelf {shelf}"
        else:
            location_text = "📍 Location not specified"

        reason = "A strong fit for your learning goal because it gives clear, practical guidance without overwhelming beginners."

        return (
            f"{title}\n"
            f"Author: {author}\n"
            f"Level: {level}\n"
            f"Availability: {availability_text}\n"
            f"Location: {location_text}\n"
            f"Why it fits: {reason}"
        )

    explanation = "\n\n".join(
        format_book_block(book) for book in recommended_books[:3]
    )

    return {
        "query": query,
        "explanation": explanation,
        "recommended_books": recommended_books,
    }