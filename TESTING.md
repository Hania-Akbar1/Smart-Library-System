# Testing Guide

This document covers the minimum verification for local development and future deployment readiness.

## 1) Frontend testing

### Core user flows

- Search for a topic such as Python, AI, or machine learning
- Apply filters by level, category, and availability
- Open book details
- Save a book
- View recommendations after a follow-up prompt
- Confirm search results render without broken layout

### Error cases

- Empty search query
- No matching books
- API failure from backend
- Slow backend response
- Invalid session or request payload

### Browser checks

- Confirm no stack traces are shown to the user
- Verify no API keys or backend secrets appear in client-side code
- Test reload behavior and page state recovery

## 2) Backend testing

### API checks

Use curl or Postman to test:

- `GET /` to verify server health
- `GET /books`
- `GET /books/{id}`
- `GET /search?query=python`
- `POST /chat` with valid and invalid JSON
- `POST /chat` with empty message
- Requests from a non-whitelisted origin

### Valid input tests

- Normal book search term
- Clear learning goal
- Follow-up question using prior context

### Invalid input tests

- Missing `session_id`
- Empty `message`
- Very long input
- Malformed JSON
- Non-UTF-8 or unexpected content type

### Error handling

- Groq service outage
- Supabase offline
- Embedding model unavailable
- Timeout from external API

Expected behavior:
- Clean HTTP error response
- No sensitive internals exposed
- Fallback recommendation message when AI is unavailable

## 3) Database testing

- Confirm Supabase credentials are valid
- Verify the `books` table loads normally
- Confirm `embedding` values are present when semantic search is used
- Verify `match_library_books` RPC is available and returns expected structure
- Check data integrity for missing titles, authors, or levels

## 4) AI / LLM testing

- Test recommended outputs for beginner-friendly results
- Test empty catalog behavior
- Test fuzzy or informal queries
- Test graceful handling when Groq returns an error
- Confirm the response remains readable and not overly technical

## 5) Performance checks

- Measure search latency with a few common searches
- Verify semantic search does not freeze the UI
- Confirm the app remains usable when API calls are slower
- Make sure model loading lazily avoids startup delays

## 6) Security checks

- `.env` files are present only locally
- No credentials are committed to Git
- CORS allows only known frontend origins
- Backend error responses do not reveal stack traces
- No user password or secret values are logged

## 7) Suggested manual checklist

- [ ] Frontend starts with `npm run dev`
- [ ] Backend starts with `uvicorn app.main:app --reload`
- [ ] .env files created from examples
- [ ] Supabase credentials are valid
- [ ] Groq key works
- [ ] Search works for multiple queries
- [ ] Filter and view details work
- [ ] Chat flow returns recommendations
- [ ] Empty or invalid input is handled safely
- [ ] API errors remain user-friendly
- [ ] `.gitignore` excludes env files and dependency folders
