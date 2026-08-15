# LexForge Architecture & Tech Stack

This document defines the locked technical architecture for the LexForge platform.

## 1. System Architecture
LexForge utilizes a decoupled client-server architecture to separate the intensive linguistic processing engine from the interactive user experience.

### A. Frontend Client (`web`)
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (configured with centralized design tokens for consistency)
- **State Management:** Zustand (lightweight global state for the Generation Playground)
- **Event Bus:** Custom `InteractionEventBus` (Pub/Sub pattern) to manage cross-component communication (e.g., streaming states, notifications).

### B. Core Engine Backend (`nid-extractor`)
- **Framework:** Node.js with Express
- **Language:** TypeScript
- **Purpose:** Houses the complex Linguistic AI Engine, lexical dictionaries, candidate assemblers, and aesthetic scoring mechanisms.
- **API:** Exposes a single `POST /generate` REST endpoint to the frontend.
- **Port:** Runs locally on port `4000`.

## 2. Shared Libraries (Monorepo)
- `@lexforge/ui`: Centralized React component library (buttons, inputs, cards).
- `@lexforge/design-tokens`: Centralized styling variables (colors, typography).

## 3. Deployment & Build
- **Build Tooling:** Turbopack (Next.js) for ultra-fast local iteration.
- **Static Generation:** Marketing pages and static routes are pre-rendered (`npm run build`) for maximum SEO and performance.

## 4. Architectural Rules
- **No Engine Logic in Frontend:** The `web` directory must NOT contain linguistic dictionaries or generation logic. All generation requests must be routed through `GenerationService.ts` to the backend.
- **Strict Typing:** All data flowing between the backend (`nid-extractor`) and the frontend (`web`) must adhere strictly to the `GenerationResult` interfaces.