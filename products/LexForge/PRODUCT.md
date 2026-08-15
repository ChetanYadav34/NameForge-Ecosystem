# LexForge: Product Requirements Document (PRD)

## 1. Vision & Core Loop
**LexForge** is an Algorithmic Branding Engine. It combines human linguistic science with artificial intelligence to generate brand names that are memorable, meaningful, pronounceable, and globally brandable.

**Core Loop:**
1. **Input:** The user inputs a conceptual seed, industry, and desired tone (e.g., "cybersecurity", "tech", "modern").
2. **Generation:** The engine (`nid-extractor`) cross-references phonetics, morphology, and semantics to generate a highly curated, non-repetitive list of names.
3. **Selection (Playground):** The frontend presents the candidates beautifully with contextual scores (Brandability, Availability Risk).
4. **Action:** The user selects a name and moves toward domain acquisition or trademark searches.

## 2. Target Audience
- **Founders & Indie Hackers:** Need striking, available names quickly without hiring a branding agency.
- **Branding Agencies:** Need high-volume inspiration with deep linguistic justification for client presentations.
- **Enterprise Product Teams:** Need distinct product/feature names that align with existing naming architectures.

## 3. Product Principles (The "Impeccable" Standard)
- **Zero Fluff:** Get the user to the core value (the Generation Playground) as fast as possible. Remove all unnecessary marketing friction.
- **Trust through Aesthetics:** The UI must feel like a premium, specialized scientific tool, not a generic SaaS template. 
- **Deterministic Quality:** The generated names must enforce strict linguistic diversity (no endless "Base" or "Hub" suffixes).

## 4. Current State (Phase 9)
- The backend generation engine (`nid-extractor`) is fully decoupled and optimized for diversity and 4-8 letter aesthetic scoring.
- The Next.js frontend has been aggressively pruned from 24 routes down to 9 core routes.
- The marketing site acts solely as a high-conversion funnel into the `/playground`.