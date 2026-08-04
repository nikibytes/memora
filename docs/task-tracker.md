# Task Tracker — Memora

> If `squad` module is installed: use this exact line format so `scripts/next_task.sh` can parse it —
> `- [ ] <task text> — status: Backlog — claimed_by: none`
> Valid statuses: `Backlog`, `Claimed`, `In Progress`, `Ready for QA`, `In QA`, `Ready for Review`, `In Review`, `Architecture Review Needed`, `Completed`. Update the status and claimed_by fields in place as the item moves — don't rewrite it as a new line.

## Backlog
- [ ] Let users semantically search from their own saved IG collections (1-2 word queries → full sentences)
  - [ ] Design/schema
  - [ ] Implementation
  - [ ] Tests
- [ ] Support location-aware retrieval (match saved posts to user's city/country)
  - [ ] Design/schema
  - [ ] Implementation
  - [ ] Tests
- [ ] Build chat & search UI (PWA chat interface, result cards, agent responses)
  - [ ] Chat-style UI for entering natural language queries
  - [ ] Display area for agent responses
  - [ ] Rich media result cards (images/videos) pointing to Instagram CDN URLs
- [ ] Build content extraction pipeline (caption, audio transcription, vision extraction)
  - [ ] Routing logic based on media type and signal strength
  - [ ] Image/Video Caption extraction
  - [ ] Audio transcription (Whisper)
  - [ ] Vision fallback (Gemini Flash)
- [ ] Setup Supabase Postgres with pgvector + embeddings
  - [ ] Database schema (RLS keyed by user_id)
  - [ ] Embedding generation (Nomic/BGE-M3/Gemini)
  - [ ] Store records referencing ig_media_pk and ig_url
- [ ] Implement sync mechanism (24h scheduled + manual trigger + diffing)
- [ ] Security & compliance (ON DELETE CASCADE, disconnect action, consent screen)
- [ ] Configure PWA manifest and service workers for installability
- [ ] Browser geolocation integration (permission prompt + lat/lng in queries)
- [ ] Session expiration/re-login prompt UI
- [ ] Re-auth detection and handling flow

## In Progress
( none — all previously in-progress items resolved this session )

## Completed
- [x] Build PWA React UI: Landing page, Login page, and Main Screen showing Instagram collections — status: Completed — claimed_by: coder
- [x] Wire login form with accurate disclaimer (no credential storage, one-time browser cookie pairing) — status: Completed — claimed_by: coder
- [x] Implement sessionHelper.ts loginAndGetSession() with Puppeteer auto-login, 2FA detection, persistent Chromium profile, full cookie-jar capture — status: Completed — claimed_by: coder
- [x] Implement SQLite session dump (lib/db.ts) — status: Completed — claimed_by: coder
- [x] Implement two-step 2FA handshake (start → challengeId → verify-2fa route) — status: Completed — claimed_by: coder
- [x] Implement auth orchestration API routes (/session, /verify-2fa, /status) — status: Completed — claimed_by: coder
- [x] Remove react-native deps, fix build (Turbopack error) — status: Completed — claimed_by: coder
- [x] Fix fetch URL (port 5678 → 8000) and request body shape — status: Completed — claimed_by: coder
- [x] Configure Antigravity .vscode debug (launch.json, settings.json with absolute interpreter path) — status: Completed — claimed_by: coder
- [x] Setup isolated backend Python venv (uv-managed CPython 3.11, fastapi + uvicorn + instagrapi + debugpy) — status: Completed — claimed_by: coder
