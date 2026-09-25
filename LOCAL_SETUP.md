# Local Setup Guide

This project is split into a separate frontend and backend so they can be deployed independently.

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- A Supabase project
- A Groq API key
- Git

## 1) Clone and install

```bash
git clone <your-repo-url>
cd smart-library-ai
```

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd ../backend
python -m venv .venv

# Windows
.\.venv\Scripts\activate

# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
```

## 2) Environment files

Create local environment files from the examples.

### Backend

```bash
cd backend
copy .env.example .env
```

Then edit `.env` and fill in the real values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
GROQ_API_KEY=your-groq-api-key
HUGGINGFACE_API_KEY=hf_your_token
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
PORT=8000
APP_ENV=development
LOG_LEVEL=INFO
```

Notes:
- `SUPABASE_URL` comes from Supabase project settings > API.
- `SUPABASE_KEY` is the project API key. Keep it server-side only.
- `GROQ_API_KEY` is generated in your Groq account.
- `HUGGINGFACE_API_KEY` is generated from Hugging Face and used for cloud-based embeddings.
- `ALLOWED_ORIGINS` must include the frontend origin used by Vite.

5. Get Hugging Face API Key:
   - Visit https://huggingface.co/settings/tokens
   - Sign up or log in with GitHub
   - Click 'New token'
   - Name: smart-library-ai
   - Type: Read (not Write)
   - Click 'Generate token'
   - Copy the token (appears only once)
   - Add to backend/.env: `HUGGINGFACE_API_KEY=hf_your_token`

### Frontend

```bash
cd frontend
copy .env.example .env
```

Then edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Smart Library AI
VITE_ENABLE_DEBUG=false
```

Important:
- Never commit `.env` files.
- Keep all secrets on the server side.

## 3) Run the backend

```bash
cd backend
.\.venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Check that it starts successfully.

## 4) Run the frontend

```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

Then open the frontend URL shown in the terminal, usually:
- http://localhost:5173

## 5) Validate the app

- Frontend loads without errors
- Search works in the UI
- Frontend calls the backend correctly
- Backend returns results for `/chat`, `/search`, `/books`, and filter flows
- No secrets or stack traces are exposed in browser UI or logs

## 6) Important security notes

- Keep `.env` files local only
- Do not put API keys in source code
- Use explicit CORS origins, not wildcard origins in production
- Ensure `.env` is included in `.gitignore`
- Use environment variables in deployment instead of committing credentials
