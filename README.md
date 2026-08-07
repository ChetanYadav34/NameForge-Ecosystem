# LexForge

**LexForge** is an advanced, algorithmically driven branding and linguistic generation engine. It processes vast datasets of semantic roots, phonetics, and ontology graphs to dynamically generate contextually aware brand names, identities, and product concepts.

This repository represents the `v0.5-alpha` release of the core generation engine and the web application interface.

## Architecture

LexForge operates through a **Dataset Compiler** and a **Next.js Web Application**.

1. **Dataset Compiler:** An offline pipeline that ingests massive JSONL datasets (e.g., `lexforge-dataset-v7.jsonl`) and distills them into lightweight, highly optimized in-memory inverted indexes.
2. **Web Application:** A Vercel-optimized Next.js application that streams linguistic generations to the client using a multi-stage pipeline (Normalization -> Expansion -> Generation -> Scoring -> Quality Gate).

### Monorepo Structure

- `products/LexForge/web`: The primary web interface and generation pipeline.
- `products/LexForge/dataset-compiler`: The offline tool used to compile raw semantic datasets into memory-safe JSON indexes.
- `packages/ui`: Shared UI library built with Tailwind CSS.
- `packages/motion`: Framer Motion component library for fluid interactions.
- `packages/design-tokens`: Tailwinds config and semantic design definitions.
- `docs/`: Comprehensive architectural guides, milestone reports, and research notes.

## Getting Started

### Prerequisites
- Node.js 20.x
- npm 10.x

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Generate Indexes (Required for Web)**
   The web app requires precompiled indexes. Run the dataset compiler to build them:
   ```bash
   npm run build --workspace=products/LexForge/dataset-compiler
   npm start --workspace=products/LexForge/dataset-compiler
   ```

3. **Run Development Server**
   ```bash
   npm run dev --workspace=products/LexForge/web
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

The `products/LexForge/web` application is configured for seamless deployment to Vercel. 
The generated `.json` indexes located in `products/LexForge/dataset-compiler/output/` are committed to version control specifically so Vercel can access them natively via the `IndexManager` at runtime without external database dependencies.

*Note: The raw datasets (`*.jsonl`) and the LexForge Studio environment are strictly excluded from Vercel deployment paths to optimize build size and security.*

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
