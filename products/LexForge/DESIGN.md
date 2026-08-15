# LexForge Design System & UX Rules (The Anti-Slop Standard)

This document serves as the canonical design truth for the LexForge frontend, leveraging guidelines from `impeccable`, `taste-skill`, and `emilkowalski/skills`.

## 1. Typography & Colors (`taste-skill`)
- **No Generic System Fonts:** The platform utilizes curated typography. **Playfair Display** (Serif) is used exclusively for primary headings to evoke authority and academic rigor. **Inter** (Sans-serif) is used strictly for utility text and UI elements to ensure legibility.
- **Color Palettes:**
  - **No Pure Black/Gray:** All blacks and grays must be tinted with the primary brand color (e.g., slate/zinc) to maintain harmony. Avoid `#000000` or `#FFFFFF` harsh contrasts.
  - **No Gray Text on Colored Backgrounds:** Ensure high-contrast legibility. 
  - **Primary Accents:** Use constrained, purposeful accents (orange/amber) for primary actions. No rainbow gradients unless specifically contextually justified.

## 2. Layout & Components (`impeccable`)
- **Ban the "Bento Box" Cliché:** Avoid stuffing irrelevant icons into rounded boxes. Every component must serve a distinct functional purpose.
- **No Nested Cards:** Do not place a rounded card inside another rounded card with a slightly different background. Use whitespace, subtle dividers, or structural alignment to create hierarchy instead.
- **Whitespace is Structure:** Maximize padding and margins to create a breathing, premium interface.
- **Single Canonical CTA:** Every view should have a single, undeniable primary action (e.g., "Start Naming").

## 3. Motion & Interaction (`emilkowalski/skills`)
- **Enter Animations:** Use `ease-out` for all elements entering the viewport (e.g., generated names appearing on screen). This makes them feel fast and responsive.
- **Exit Animations:** Use `ease-in` for elements leaving the screen.
- **Micro-interactions:** Buttons and interactive cards should have subtle hover states (`hover:-translate-y-0.5`, `transition-all`, enhanced shadows) to invite interaction without being distracting.
- **No Bouncy/Elastic Easing:** Avoid dated elastic bounces. Stick to refined, professional cubic-bezier curves for a premium feel.

## 4. Implementation Rules
- Tailwind CSS is the primary styling engine.
- Always utilize the predefined design tokens in `@lexforge/design-tokens` (via the monorepo) or the local `tailwind.config.ts`.