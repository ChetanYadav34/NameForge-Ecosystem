// ============================================================================
// LexForge Dataset Compiler — Configuration
// ============================================================================
// Centralizes all paths, filenames, and settings for the compilation pipeline.
// Change outputPath to redirect output to a different directory without
// modifying any other code.
// ============================================================================

import path from "node:path";
import { CompilerConfig } from "../types/index.js";

/**
 * Resolve a path relative to the project root (dataset-compiler/).
 */
export function projectRoot(...segments: string[]): string {
  // At runtime: dist/src/config/ → up 3 levels → project root
  return path.resolve(__dirname, "..", "..", "..", ...segments);
}

/**
 * Default compiler configuration.
 *
 * Input:  Raw resource files from d:\Projects\resourses\
 * Output: Development output in dataset-compiler/output/
 *
 * To export to the ecosystem datasets directory, change outputPath to:
 *   projectRoot("..", "..", "..", "datasets", "generated")
 *
 * Or override via environment variables:
 *   LEXFORGE_OUTPUT_PATH=d:\Projects\NameForge-Ecosystem\datasets\generated
 */
export const config: CompilerConfig = {
  // --- Input Sources ---
  wordsAlphaPath:
    process.env["LEXFORGE_WORDS_PATH"] ||
    projectRoot("..", "..", "..", "resources", "words_alpha.txt"),

  cmudictPath:
    process.env["LEXFORGE_CMUDICT_PATH"] ||
    projectRoot("..", "..", "..", "resources", "cmudict.dict"),

  // --- Output ---
  outputPath:
    process.env["LEXFORGE_OUTPUT_PATH"] ||
    projectRoot("output"),

  outputFilename: "lexforge-dataset-v7.jsonl",
  statsFilename: "stats.json",
  manifestFilename: "dataset.manifest.json",

  // --- Metadata ---
  compilerVersion: "7.0.0",
  datasetVersion: "7.0.0",
  schemaVersion: "7.0",
};
