# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0-alpha] - 2026-08-08

### Added
- **LexForge Web App**: Core Next.js interface for generating linguistic and semantic clusters.
- **Generation Engine**: Advanced linguistic clustering algorithms supporting Latin, Greek, and Sanskrit roots.
- **Dataset Compiler**: Automated offline pipeline to compile `lexforge-dataset-v7.jsonl` into memory-optimized Vercel inverted indexes (`semantic-index.json`, `ontology-index.json`, `definition-index.json`).
- **Semantic Root Mapping**: The generation engine now actively maps dynamically generated words back to their source dataset dictionary definitions in real-time.
- **UI Components**: A cohesive, robust design system using Tailwind CSS and Framer Motion.

### Changed
- Monorepo structure fully audited and organized for Vercel deployment.
- Excluded experimental apps and developer studio from public deployment paths to maximize stability and build speed.
- Re-architected backend `IndexManager` to fetch dictionary meanings without incurring external database latency.

### Removed
- Removed unused product stubs (NameForge-App, NameForge-Engine, RootForge).
- Removed raw JSONL dataset from version control.
