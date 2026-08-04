# Product Requirements — Memora

`purpose:AI-powered search agent for your Instagram saved collections — find any saved post using natural language instead of scrolling`
`target_audience:everyone`

## Value Proposition
Allow users to find their saved Instagram posts using natural language search and location-aware retrieval, instead of scrolling infinitely through their collections.

## Target Audience
everyone

## MVP Scope (v1)
1. Let users semantically search from their own saved IG collections (1-2 word queries → full sentences)
2. Support location-aware retrieval (match saved posts to user's city/country)

## Explicitly Out of Scope (v1)
TBD — configure later

## Stack
- Tech Stack: Next.js (React) + Python (FastAPI)
- Database: Supabase (Postgres with pgvector)
- Authentication: Instagram OAuth/Login
- Hosting/Deploy: Vercel
- APIs/Integrations: Instagram API / instagrapi

## Success Criteria
- [ ] All MVP features pass their test cases in `docs/testing-playbook.md`
- [ ] No item in "Out of Scope" is present in the shipped code
- [ ] `docs/task-tracker.md` backlog is fully checked off

## Change Log
| Date | Change | Reason |
|------|--------|--------|
| 2026-08-01 | Initial PRD created | Project init |
