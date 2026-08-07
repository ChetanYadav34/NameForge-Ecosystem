// ============================================================================
// LexForge Dataset Compiler — Entry Point
// ============================================================================
// Orchestrates the full compilation pipeline:
//
//   1. Import words_alpha.txt
//   2. Import cmudict.dict
//   3. Normalize
//   4. Merge
//   5. ARPABET → IPA transformation
//   6. Validate
//   7. Build dataset
//   8. Export to JSONL + stats.json + manifest
//
// Each step is timed and logged. If any step fails, the pipeline halts
// with a clear error message.
// ============================================================================

import { LexForgeCompiler } from "./compiler/compiler.js";
import { logger } from "./utils/logger.js";

/**
 * Main compilation pipeline entry point.
 */
async function main(): Promise<void> {
  try {
    LexForgeCompiler.bootstrap();
    await LexForgeCompiler.execute();
  } catch (error) {
    logger.error("Pipeline failed:");
    console.error(error);
    process.exit(1);
  }
}

// Start pipeline
main();
