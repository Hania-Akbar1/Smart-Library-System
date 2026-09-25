# Smart Library AI Backend

This is the FastAPI backend for Smart Library AI. It provides book data access, AI-powered recommendation search, and chat-based library assistance using Supabase and Groq.

## Project purpose

The backend:
- serves library data from Supabase
- searches books by title or natural-language query
- performs vector similarity search for recommendations
- creates AI explanations for recommended books
- powers the frontend chat assistant

## Stack

- Python
- FastAPI
- Uvicorn
- Supabase Python client
- python-dotenv
- Groq
- requests
- Hugging Face Inference API

## Project structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── main.py
│   ├── supabase_client.py
│   └── services/
│       └── book_service.py
├── tests/
│   └── test_supabase.py
├── .env.example
├── .env                     # local secrets, not committed
├── requirements.txt
├── README.md
├── TEAM_GUIDE.md
└── .gitignore
```

## Setup

```bash
cd backend
python -m venv .venv
# Windows
.\.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate
pip install -r requirements.txt
```

## Environment variables

Copy `.env.example` to `.env` and fill in real values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
GROQ_API_KEY=your-groq-api-key
HUGGINGFACE_API_KEY=hf_xxxxx
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
PORT=8000
```

## Setup: Hugging Face API Key

1. Go to https://huggingface.co/settings/tokens
2. Create a new token and name it `smart-library-ai`
3. Choose token type: `Read`
4. Copy the token and add it to `backend/.env`:

```env
HUGGINGFACE_API_KEY=hf_xxxxx
```

This token is used for cloud-based semantic embeddings and should be treated as a sensitive secret.

## Run locally

## Run locally

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Or:

```bash
python -m app.main
```

## Main endpoints

- `GET /` - health check
- `GET /books` - fetch all books
- `GET /books/search?query=...` - title search
- `GET /books/rag?query=...&count=5` - AI recommendation search
- `GET /books/{book_id}` - fetch a single book
- `POST /chat` - chat assistant session endpoint

## Notes

- Do not commit `.env` files.
- The backend expects a valid Supabase project and Groq API key.
- CORS is configured with `ALLOWED_ORIGINS` for frontend access.
