# Contributing to NameForge Ecosystem

First off, thanks for taking the time to contribute! 🎉

## Development Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/nameforge-ecosystem.git
   cd nameforge-ecosystem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the dataset compiler**
   Before running the web app, you must generate the dataset indexes.
   ```bash
   npm run build --workspace=products/LexForge/dataset-compiler
   npm start --workspace=products/LexForge/dataset-compiler
   ```

4. **Start the web application**
   ```bash
   npm run dev --workspace=products/LexForge/web
   ```

## Repository Structure

- `products/LexForge/web`: The main Next.js web application.
- `products/LexForge/dataset-compiler`: The offline compiler tool.
- `packages/ui`: Shared React components.
- `packages/design-tokens`: Tailwinds styling configurations.
- `packages/motion`: Framer motion defaults.
- `docs/`: Architecture and milestone documentation.

## Pull Request Process
1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface.
3. You may merge the Pull Request in once you have the sign-off of two other developers.
