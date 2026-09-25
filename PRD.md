# Product Requirements Document (PRD)

## 1. Product Overview

Smart Library AI is an AI-powered library recommendation platform that helps users discover books based on learning goals, topics, and reading preferences. The system combines a React frontend with a FastAPI backend, Supabase data access, Groq-powered conversational logic, and Hugging Face semantic embeddings for recommendation search.

The product is designed for users who want a faster, more intuitive way to find relevant books and get guidance without manually browsing the catalog.

---

## 2. Product Goal

Provide a personalized book discovery experience that:

- understands user learning goals
- recommends relevant books from the library catalog
- supports natural-language and conversational queries
- handles greetings, off-topic queries, and multilingual inputs
- works across frontend and backend as independent deployment units

---

## 3. Target Users

### Primary users
- Students
- Learners seeking technical or academic books
- Library visitors looking for reading recommendations
- Users browsing by topic rather than exact title

### Secondary users
- Library admin or catalog managers
- Developers maintaining the backend and deployment setup

---

## 4. Core Problem

Users often struggle to find the right book quickly because:

- they may not know the exact title
- they describe goals in natural language instead of catalog terms
- they want recommendations based on topic, level, and availability
- they expect a conversational assistant rather than a static search form

---

## 5. Product Vision

Create a library assistant that feels like a helpful human librarian:

- ask for a topic or learning goal
- interpret the intent
- search the catalog semantically
- recommend useful books with metadata
- respond politely for greetings, irrelevant questions, and unsupported searches

---

## 6. Key Features

### 6.1 Book Search
- Search books by title and topic keywords
- Return metadata such as title, author, level, availability, rack, and shelf

### 6.2 Semantic Recommendation Engine
- Use AI-generated embeddings to match user queries with relevant books
- Use similarity thresholds to filter weak or unrelated results
- Prioritize books that match the user’s learning intent

### 6.3 Conversational Assistant
- Accept user chat messages
- Detect greeting vs. recommendation intent
- Interpret learning goals and recommend books
- Support simple conversation flow with memory per session

### 6.4 Multilingual Input Handling
- Support English language queries
- Handle Roman Urdu phrases such as “mujhe python seekhna hai”
- Translate or interpret casual query language into search intent

### 6.5 Book Metadata Display
- Show book title, author, level, location, and availability
- Present results in a readable recommendation format

### 6.6 Security and Configuration
- Keep secrets in local .env files and deployment secret stores
- Restrict origins via ALLOWED_ORIGINS
- Do not expose credentials to browser code

---

## 7. User Stories

### As a learner
- I want to search for Python books by learning goal so that I can find relevant resources quickly.
- I want recommendations based on my topic and skill level so that I can start with the right book.
- I want the app to understand natural language so that I don’t need to know exact titles.

### As a library user
- I want to know if a book is available so that I know whether I can borrow it.
- I want to know where the book is located so that I can find it in the library.

### As a developer
- I want a clear backend and frontend split so that deployment and maintenance are easier.
- I want the app to use secure environment variables so that secrets are not hardcoded.

---

## 8. Functional Requirements

### Frontend
- Show the library landing page and search interface
- Allow users to submit learning queries
- Display recommended books and metadata
- Show chat responses in a conversational UI
- Handle greeting and off-topic message states gracefully

### Backend
- Expose REST API endpoints for home, books, search, RAG, and chat
- Return book metadata from Supabase
- Generate embeddings using Hugging Face API
- Match user queries to books using semantic similarity
- Handle invalid or empty queries gracefully

### AI behavior
- Recognize greeting messages separately from book requests
- Return no recommendations for irrelevant or off-topic requests
- Return polite fallback messages when no suitable matches are found
- Translate informal queries into English when needed

---

## 9. Non-Functional Requirements

### Performance
- Backend should respond quickly for normal search requests
- Embedding calls should complete within a reasonable timeout window
- Memory should remain stable without loading a local model unnecessarily

### Reliability
- Missing or invalid configuration should fail gracefully
- API errors should not crash the app completely
- Invalid credentials should produce controlled error responses

### Security
- Store secrets only in environment variables
- Keep Supabase and API keys out of source-controlled files
- Avoid wildcard CORS in production

### Maintainability
- Keep frontend and backend separated for deployment
- Centralize configuration through environment files
- Keep documentation aligned with architecture changes

---

## 10. Architecture Summary

### Frontend
- React + Vite
- Tailwind CSS for styling
- UI components for search, chat, and recommendation display

### Backend
- Python FastAPI application
- Uvicorn server
- Supabase for data retrieval
- Groq for chat and LLM-based intent handling
- Hugging Face Inference API for semantic embeddings

### Data flow
1. User enters a learning goal or topic
2. Frontend sends request to backend
3. Backend detects intent and builds a semantic search query
4. Hugging Face API generates the embedding for the query
5. Supabase vector match function finds relevant books
6. Results are formatted and returned to the UI

---

## 11. API Expectations

### Core endpoints
- GET /
- GET /books
- GET /books/search
- GET /books/rag
- GET /books/{book_id}
- POST /chat

### Response behavior
- / returns a simple health status
- /books returns catalog data
- /chat returns structured response with recommended books and explanation text
- edge cases return polite fallback responses instead of system errors

---

## 12. Environment and Deployment Requirements

Required environment variables include:

- SUPABASE_URL
- SUPABASE_KEY
- GROQ_API_KEY
- HUGGINGFACE_API_KEY
- ALLOWED_ORIGINS
- PORT=8000

Deployment configuration should:

- use managed secrets rather than committed .env files
- set explicit trusted origins
- ensure frontend uses the correct backend URL
- keep local and production configs separate

### Verified status
- backend startup is working locally
- health and books endpoints respond successfully
- required env variables are present
- Hugging Face embedding integration is active
- dependency cleanup is complete for the local-model migration

### Areas still recommended for final validation
- browser frontend flow
- edge-case error handling
- timeout/failure tests
- memory usage benchmarking under load
- production CORS and deployment domain configuration

---

## 14. Risks and Mitigations

### Risk: API keys exposed
Mitigation: keep secrets in .env locally and in deployment secret managers.

### Risk: invalid or slow embeddings API
Mitigation: enforce request timeout and graceful fallback responses.

### Risk: off-topic or bad prompts
Mitigation: classify greeting/off-topic requests separately and avoid recommending unrelated books.

### Risk: deployment mismatch
Mitigation: maintain clear frontend/backend config and explicit allowed origins.

---

## 15. Future Enhancements

- user authentication and saved library history
- personalized recommendations based on past reading
- admin dashboard for catalog management
- multilingual support across more languages
- deeper analytics for user behavior and recommendation quality
- production deployment for cloud hosting and domain configuration

---

## 16. Success Criteria

The product is successful when:

- users can find relevant books using natural-language queries
- recommendations match learning goals and skill level
- greetings and off-topic messages are handled gracefully
- backend remains stable and secure in deployment
- frontend and backend communicate reliably without CORS issues

---

## 17. Final Summary

Smart Library AI is a library discovery and recommendation product that combines a modern React frontend, a FastAPI backend, Supabase data access, and AI-powered semantic search. The system is designed to help users find the right books based on intent, topic, and learning goals rather than exact titles alone. The recent Hugging Face migration improves maintainability and reduces local model dependency while keeping the project suitable for local QA and deployment preparation.
