# Security Notes

This document summarizes the current security posture for Smart Library AI and highlights issues that should be fixed before production deployment.

## Current state

### Positive findings

- Secrets are stored in local `.env` files rather than hardcoded in source code.
- The backend loads environment variables through `python-dotenv`.
- The frontend uses `VITE_API_BASE_URL` from environment variables instead of embedding a production URL in code.
- The backend uses `ALLOWED_ORIGINS` instead of a completely open CORS policy.
- The repo includes `.gitignore` rules to exclude common local and generated artifacts.

### Risks to address before production

1. CORS is still too permissive in some deployment contexts
   - `ALLOWED_ORIGINS` is loaded from an environment variable, which is good.
   - However, if the deployment value contains `*` or an overly broad list, it can expose the API to unauthorized origins.
   - Fix: keep explicit, trusted domains only.

2. Supabase access must remain server-side only
   - The backend uses a service key or server-side API key.
   - Frontend should never receive or use this value.
   - Fix: ensure the frontend never imports or exposes Supabase credentials.

3. API keys must be kept in deployment secrets, not in source control
   - Local `.env` files are okay, but they must remain gitignored.
   - `HUGGINGFACE_API_KEY` is sensitive — treat it like `GROQ_API_KEY`. Never commit it to git.
   - The key is used for cloud-based embeddings and should be kept server-side only.
   - Fix: use deployment secret management for production.

4. Input validation is basic and should be tightened
   - The backend accepts user input for chat sessions and search queries.
   - Additional validation should reject overly long messages and malformed payloads consistently.
   - Fix: add request validation and size limits.

5. Logging should be carefully reviewed
   - The project currently avoids obvious secret logging in the files reviewed.
   - Still, logs in production should never include raw request bodies, tokens, or user data.
   - Fix: allow structured logging with redaction.

6. Error handling should stay user-safe
   - API errors should not expose stack traces or internal infrastructure details.
   - Fix: return sanitized errors to the client.

7. Authentication/authorization is not yet implemented
   - This app appears to be a public library assistant, but some endpoints may require user-bound access in the future.
   - Fix: add authentication and role-based authorization before exposing personal or sensitive data.

## Recommended production hardening checklist

- Restrict CORS to verified production origins only
- Use deployment-managed secrets, not `.env` files in production
- Add request size limits and input validation
- Add explicit auth for user-specific actions
- Log sanitized metadata only
- Add rate limiting for public endpoints
- Add health checks and monitoring
- Verify Supabase row-level security policies
- Verify RLS for any user-facing or private data

## Minimum deployment guidance

Before going live:

- Review all `.env` files and ensure none are tracked
- Verify all secrets are referenced through deployment secrets
- Review CORS configuration for each environment
- Audit logs for leaked content
- Test invalid input and failure states
- Test Groq and Supabase outages gracefully
- Confirm that users cannot access protected backend internals
