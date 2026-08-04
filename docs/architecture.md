# Architecture — Memora

## Data Flow (high level)
User authenticates via Instagram OAuth -> Next.js PWA sends queries to FastAPI backend -> FastAPI queries Supabase vector DB -> returns semantically matching saved Instagram posts (with location-aware filtering).

## Directory Map
```
Memora/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # App header with logo, PWA install & view selector
│   │   ├── LandingPage.tsx      # Hero section, feature highlights & search simulator
│   │   ├── LoginPage.tsx        # Instagram OAuth login & demo account connection
│   │   ├── DashboardPage.tsx    # Collections grid, NLP search, location filters & post viewer modal
│   │   ├── PwaInstallBanner.tsx # PWA install prompt & offline status banner
│   │   └── Footer.tsx           # Footer with tweakcn theme attribution
│   ├── data/
│   │   └── mockCollections.ts   # Instagram collections & saved posts dataset
│   └── styles/
│       └── theme.css            # Tweakcn theme CSS tokens & design system
├── public/
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # PWA Service worker
└── docs/
```

## Schemas
Mock data structures defined in [mockCollections.ts](file:///c:/Users/crudg/Documents/Work/Hermes/insta-collections/src/data/mockCollections.ts) (`CollectionCategory` & `SavedPost` with vector metadata, location, OCR text and audio transcripts).

## Key Modules
| Module | Path | Responsibility |
|--------|------|-----------------|
| PWA UI Frontend | src/ | React PWA UI with Landing, Login, Dashboard, Location Filters & Search |
| Theme System | src/styles/theme.css | Tweakcn visual theme (cmsbjfbp0000204kv5mkv4wlf) + OKLCH/HSL dark mode |
| Backend | backend/ / src/ | Python API for semantic search |

## External Dependencies
Instagram API (instagrapi), Supabase, React 18, Vite 5, Lucide React, Tweakcn Live Preview (`live-preview.min.js`)

## Update Rule
This file is updated by the agent whenever a new module, schema, or external dependency is added — same commit as the code change, never deferred.
