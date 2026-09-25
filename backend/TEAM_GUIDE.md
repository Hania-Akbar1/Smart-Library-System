# Team Guide

## Project Overview
This project is a library AI application focused on helping users discover relevant books based on their learning goals.

The current system already supports:
- reading books from Supabase
- title-based search
- a single-book lookup by ID
- AI recommendation using embeddings + Groq

Example learning request:
> "I want to learn advanced English grammar."

The expected result is a list of relevant books with details such as:
- title
- author
- level
- availability
- section
- rack
- shelf

---

## What is already built
The project already has a working backend foundation and AI recommendation flow.

Current stack:
- Python
- FastAPI
- Supabase
- supabase-py
- python-dotenv
- sentence-transformers
- Groq

Current backend APIs:
- GET /
- GET /books
- GET /books/search?query=Clean%20Code
- GET /books/rag?query=...&count=5
- GET /books/{book_id}

Database:
- Supabase
- public.books table
- Columns: id, title, author, section, level, rack, shelf, availability
- Book data is already present and available for querying

This is the current working base for the project.

---

## Team Members and Responsibilities

### 1. Backend Member
Role: maintain the main API and Supabase integration.

What to do:
- keep FastAPI running correctly
- maintain the Supabase connection
- keep /books, /books/search, /books/rag, and /books/{book_id} stable
- handle errors and validation
- keep code simple and clean

What not to do:
- do not break the API contract
- do not ignore environment configuration
- do not add unrelated features without approval

---

### 2. AI / RAG Member
Role: maintain the recommendation flow and embeddings logic.

What to do:
- understand the Supabase table structure
- check how embeddings and RPC matching work
- review prompt construction for Groq responses
- improve recommendation quality and query matching
- keep the retrieval flow aligned with the backend API

Important note:
This role is not separate from the project itself; the RAG logic is already present and should be maintained carefully.

What not to do:
- do not rewrite the backend unnecessarily
- do not change API behavior without checking the main flow
- do not make the system dependent on random or fake data

---

### 3. Frontend Member
Role: build the user interface for book search and recommendation results.

What to do:
- design a simple interface for entering learning goals
- show recommended books with metadata
- display location details like rack and shelf
- connect to the real backend API

What not to do:
- do not hardcode all book data
- do not create a fake separate database
- do not ignore the API contract
- do not build features that bypass the backend

---

## Important note for every team member
Each person should:
1. open the project in the IDE
2. read the current files before coding
3. understand the existing backend and AI flow
4. work only on their assigned role
5. avoid overlapping changes unless asked

This is the correct workflow for the team.

---

## Current project functionality
The project currently does this:
- fetch all books
- search books by title
- get one book by ID
- recommend books using embeddings and vector search
- produce a natural-language summary using Groq

This is the real current foundation of the project.

---

## Basic project flow
```text
User asks: "I want to learn advanced English grammar"
      |
      v
Frontend sends learning request
      |
      v
RAG / recommendation layer
      |
      v
Supabase book data + embeddings
      |
      v
Relevant books + explanation
      |
      v
Frontend displays recommendation cards
```

---

## Simple team rule
- Backend keeps the system running.
- AI/RAG improves recommendation quality.
- Frontend displays the results.

No one should do extra work outside their role.

---

## Final reminder
This document is for team guidance only. Before coding, each member should first read the real project files and then work according to their role. The project already includes AI/RAG functionality, so the team must respect the current implementation rather than treating it as a simple CRUD backend.
