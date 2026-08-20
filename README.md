# LexForge

**LexForge** is an algorithmically driven branding and linguistic generation engine. It processes curated datasets of semantic roots, phonetics, and ontology graphs to generate contextually aware, brandable names with availability signals.

> **Current Release:** `v1.0.0` — First stable production deployment.  
> Live at: **[name-forge-ecosystem-web.vercel.app](https://name-forge-ecosystem-web.vercel.app)**

---

## What It Does

1. You type a concept or intent (e.g., *"AI-powered healthcare platform"*).
2. LexForge's generation pipeline extracts semantic intents, routes them through archetypal patterns, assembles morpheme candidates, validates and scores them.
3. You get a ranked list of brandable names with domain and trademark availability signals.

---

## Architecture

```
User Browser
     │
     ▼
Vercel (Frontend)
Next.js 16.3 · React 19 · Tailwind CSS · Framer Motion · Three.js
     │
     │  POST /generate
     ▼
Cloudflare Workers (Backend API)
TypeScript · Node.js compat · lexforge-api
     │
     │  D1 SQL queries
     ▼
Cloudflare D1 (Database)
SQLite · lexforge-db
Morpheme table · Concept table · Archetype table
```

### Monorepo Structure

```
NameForge-Ecosystem/
├── products/
│   └── LexForge/
│       ├── web/              # Next.js frontend → Vercel
│       └── nid-extractor/    # Cloudflare Workers backend → CF
├── packages/
│   ├── ui/                   # Shared component library (Tailwind)
│   ├── motion/               # Framer Motion component library
│   └── design-tokens/        # Tailwind config + semantic tokens
└── STABLE_CHECKPOINT.md      # Deployment state, known issues, next steps
```

---

## Generation Pipeline

```
Input Intent
    │
    ▼
Intent Extractor        — semantic concept extraction
    │
    ▼
Archetype Router        — maps intent to naming strategy (modern, aggressive, luxurious, trustworthy)
    │
    ▼
Candidate Assembler     — morpheme combination from D1 database (batched IN queries)
    │
    ▼
Phonotactic Engine      — scores phonetic rhythm and pronounceability
    │
    ▼
Mutation Engine         — applies consonant substitution, suffix appending, boundary smoothing
    │
    ▼
Candidate Validator     — rejects dictionary words, too-short strings, exact intent passthrough
    │
    ▼
Generation Scorer       — composite score: brandability, phonetics, mutation quality, availability
    │
    ▼
Ranked Results          — name + scores + domain (.com/.io/.ai/.co) + trademark availability
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 20+
- npm 10+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) for backend dev

### Frontend

```bash
cd products/LexForge/web
npm install

# Create .env.local:
# NEXT_PUBLIC_API_URL=https://lexforge-api.chetan3contact.workers.dev

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Backend (Cloudflare Workers)

```bash
cd products/LexForge/nid-extractor
npm install

# Create .dev.vars with your D1 database credentials (never commit this file)

npx wrangler dev
```

---

## Deployment

| Service | Platform | Command |
|---|---|---|
| Frontend | Vercel (auto-deploy on push to `main`) | `git push` |
| Backend API | Cloudflare Workers | `npx wrangler deploy` |
| Database | Cloudflare D1 | Managed via Wrangler |

### Environment Variables

**Frontend (Vercel dashboard / `.env.production`):**
```
NEXT_PUBLIC_API_URL=https://lexforge-api.chetan3contact.workers.dev
```

**Backend (`wrangler.toml`):**
```toml
name = "lexforge-api"
main = "src/index.ts"
compatibility_date = "2024-11-01"
compatibility_flags = [ "nodejs_compat" ]

[[d1_databases]]
binding = "DB"
database_name = "lexforge-db"
database_id = "<your-d1-database-id>"
```

> ⚠️ Never commit `.dev.vars` — it is gitignored and contains sensitive D1 credentials.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 16.3 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v3 |
| Animations | Framer Motion v11 |
| 3D Background | Three.js via @react-three/fiber |
| State | Zustand |
| Backend Runtime | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| Deployment (FE) | Vercel |
| Deployment (BE) | Cloudflare Workers |
| Language | TypeScript (strict) |

---

## Lighthouse Scores (Production)

| Category | Score |
|---|---|
| Performance | ~90+ (Vercel CDN) |
| Accessibility | **100** |
| Best Practices | 96 |
| SEO | **100** |

---

## Known Limitations

- Domain and trademark availability checks use **mock providers** — not wired to real RDAP/WHOIS/USPTO APIs yet.
- Some short root-only names can appear in results (e.g., `Rel`, `Rec`).
- Favicon not yet added.

---

## Roadmap

- [ ] Real domain availability via RDAP / Domainr API
- [ ] Real trademark search via USPTO TESS
- [ ] User authentication (saved history, sessions)
- [ ] Dashboard + Playground connected to generation history
- [ ] Bundle optimization (Three.js selective imports)
- [ ] GitHub Actions CI/CD (build + lint on PRs)
- [ ] Playwright E2E tests

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
