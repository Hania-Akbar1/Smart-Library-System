# Smart Library AI

Smart Library AI is a library recommendation app with a React + Vite frontend and a FastAPI backend. The frontend handles the UI and search flow, while the backend performs book retrieval, semantic recommendation logic, Supabase access, and Groq-powered responses.

## Overview

- Frontend: React + Vite + Tailwind CSS
- Backend: FastAPI + Uvicorn + Python
- Database: Supabase
- AI: Groq LLM + Hugging Face Inference API for semantic embeddings
- Search: semantic matching against cloud-based embeddings, no local model required

## Project structure

```text
smart-library-ai/
├── .gitignore
├── README.md
├── LOCAL_SETUP.md
├── TESTING.md
├── SECURITY_NOTES.md
├── frontend/
│   ├── .env
│   ├── .env.example
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── requirements.txt
│   ├── README.md
│   ├── TEAM_GUIDE.md
│   ├── tests/
│   └── app/
└── .vscode/
```

## Environment variables

### Backend required variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
GROQ_API_KEY=your-groq-api-key
HUGGINGFACE_API_KEY=hf_your_token_here
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
PORT=8000
```

Embeddings are generated on-demand via the Hugging Face API, reducing memory requirements for deployment and removing the need for a local embedding model.

### Frontend required variables

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Local setup

Follow the full instructions in [LOCAL_SETUP.md](LOCAL_SETUP.md).

## Testing

Follow the checklist in [TESTING.md](TESTING.md).

## Security notes

Review the current project posture in [SECURITY_NOTES.md](SECURITY_NOTES.md).

## Important notes

- `.env` files must stay local and never be committed.
- Secrets must live in environment variables only.
- Never expose Supabase or Groq keys in browser code.
- Use explicit origin allowlists in production.
- Keep runtime logs sanitized and avoid leaking internals.

## Local run summary

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

### Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Production readiness reminder

This project is suitable for local development, but before production deployment you should:

- restrict CORS to explicit hosts
- add authentication and authorization when needed
- validate all user inputs strictly
- keep secrets in deployment secret storage
- ensure no `.env` files are tracked in Git