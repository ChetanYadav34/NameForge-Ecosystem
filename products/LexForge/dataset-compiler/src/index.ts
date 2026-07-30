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

import { config } from "./config/index.js";
import { WordsAlphaImporter } from "./importers/words-alpha.importer.js";
import { CmudictImporter } from "./importers/cmudict.importer.js";
import { normalize } from "./normalizer/normalizer.js";
import { merge } from "./merger/merger.js";
import { ArpabetToIpaTransformer } from "./transformers/arpabet-to-ipa.transformer.js";
import { IpaToPhonologyTransformer } from "./transformers/ipa-to-phonology.transformer.js";
import { validate } from "./validator/validator.js";
import { buildDataset } from "./builder/dataset-builder.js";
import { exportDataset } from "./exporter/exporter.js";
import { logger } from "./utils/logger.js";

/**
 * Main compilation pipeline.
 */
async function main(): Promise<void> {
  const pipelineStart = performance.now();

  // --- Banner ---
  logger.banner(config.compilerVersion);
  logger.info(`Words source:  ${config.wordsAlphaPath}`);
  logger.info(`CMU dict:      ${config.cmudictPath}`);
  logger.info(`Output path:   ${config.outputPath}`);
  logger.info(`Output file:   ${config.outputFilename}`);
  logger.divider();

  // --- Step 1: Import words_alpha.txt ---
  logger.step(1, "Importing word list");
  const wordsImporter = new WordsAlphaImporter();
  const wordsResult = await logger.time(
    "Word list import",
    () => wordsImporter.import(config.wordsAlphaPath)
  );

  // --- Step 2: Import cmudict.dict ---
  logger.step(2, "Importing pronunciation dictionary");
  const cmudictImporter = new CmudictImporter();
  const cmudictResult = await logger.time(
    "CMU dict import",
    () => cmudictImporter.import(config.cmudictPath)
  );

  // --- Step 3: Normalize ---
  logger.step(3, "Normalizing data");
  const normalizedData = await logger.time(
    "Normalization",
    async () => normalize(wordsResult.data, cmudictResult.data)
  );

  // --- Step 4: Merge ---
  logger.step(4, "Merging datasets");
  const mergedRecords = await logger.time(
    "Merge",
    async () => merge(normalizedData)
  );

  // --- Step 5: ARPABET → IPA ---
  logger.step(5, "Transforming ARPABET → IPA");
  const ipaTransformer = new ArpabetToIpaTransformer();
  const ipaResult = await logger.time(
    "ARPABET → IPA",
    async () => ipaTransformer.transform(mergedRecords)
  );

  // --- Step 6: IPA → Phonology ---
  logger.step(6, "Transforming IPA → Phonology");
  const phonologyTransformer = new IpaToPhonologyTransformer();
  const phonologyResult = await logger.time(
    "IPA → Phonology",
    async () => phonologyTransformer.transform(ipaResult.records)
  );

  // --- Step 7: Validate ---
  logger.step(7, "Validating records");
  const validationReport = await logger.time(
    "Validation",
    async () => validate(phonologyResult.records)
  );

  // --- Step 8: Build dataset ---
  logger.step(8, "Building dataset");
  const dataset = await logger.time(
    "Dataset build",
    async () => buildDataset(phonologyResult.records)
  );

  // --- Step 9: Export ---
  logger.step(9, "Exporting dataset");
  
  // Calculate total transformer warnings and unknowns
  const totalTransformerWarnings = ipaResult.warnings.length + phonologyResult.warnings.length;
  // Determine total unknowns by summing unknownSymbols arrays
  let totalUnknowns = 0;
  for (const record of phonologyResult.records) {
    totalUnknowns += record.unknownSymbols.length;
  }

  await logger.time(
    "Export",
    () => exportDataset({
      entries: dataset,
      validationReport,
      duplicatesRemoved: normalizedData.duplicatesRemoved,
      transformerWarnings: totalTransformerWarnings,
      unknownIpaSymbolsCount: totalUnknowns,
      config,
    })
  );

  // --- Done ---
  const totalElapsed = Math.round(performance.now() - pipelineStart);
  logger.divider();
  logger.success(
    `Pipeline complete in ${(totalElapsed / 1000).toFixed(2)}s`
  );
}

// --- Run ---
main().catch((error: unknown) => {
  logger.error("Pipeline failed with an unrecoverable error:");
  if (error instanceof Error) {
    logger.error(error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  } else {
    console.error(error);
  }
  process.exit(1);
});
