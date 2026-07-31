// ============================================================================
// LexForge Dataset Compiler — Words Alpha Importer
// ============================================================================
// Reads words_alpha.txt — a plain text file with one English word per line.
// Uses readline for memory-efficient streaming of ~370K lines.
// ============================================================================

import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { BaseImporter } from "./base.importer.js";
import { ImportResult, RawWord, PipelineModuleMetadata } from "../types/index.js";
import { ResourceRegistry } from "../registry/resource.registry.js";
import { logger } from "../utils/logger.js";

export class WordsAlphaImporter extends BaseImporter<RawWord> {
  readonly name = "words_alpha.txt";
  readonly metadata: PipelineModuleMetadata = {
    id: "importer.wordsAlpha",
    name: "Words Alpha Importer",
    version: "1.0.0",
    stage: "import",
    priority: 10,
    requiresModules: [],
    requiresFeatures: [],
    producesFeatures: [],
    author: "LexForge",
  };

  async import(): Promise<ImportResult<RawWord>> {
    const resource = ResourceRegistry.get("resource.words_alpha");
    ResourceRegistry.markLoaded(resource.id);
    const filePath = resource.path;

    logger.info(`Reading ${this.name} from: ${filePath}`);

    const data: RawWord[] = [];
    const errors: string[] = [];
    let lineNumber = 0;

    const fileStream = createReadStream(filePath, { encoding: "utf-8" });
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const rawLine of rl) {
      lineNumber++;
      const word = rawLine.trim();

      // Skip empty lines
      if (word.length === 0) {
        continue;
      }

      data.push({ word });
    }

    logger.success(`Imported ${data.length.toLocaleString()} words from ${this.name}`);

    if (errors.length > 0) {
      logger.warn(`${errors.length} errors encountered during import`);
    }

    return {
      source: this.name,
      recordCount: data.length,
      data,
      errors,
    };
  }
}
