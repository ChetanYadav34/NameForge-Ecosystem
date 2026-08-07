// ============================================================================
// LexForge Dataset Compiler — CMU Dict Importer
// ============================================================================
// Reads cmudict.dict — the CMU Pronouncing Dictionary.
//
// Format per line:
//   WORD  P1 P2 P3 ...
//   WORD(N)  P1 P2 P3 ...        ← alternate pronunciation
//   WORD  P1 P2 P3 # comment     ← inline comment
//
// This importer:
//   • Strips inline comments (everything after #)
//   • Parses the word and its ARPABET phoneme string
//   • Detects alternate pronunciations via the (N) suffix
//   • Assigns variant numbers (1 = primary, 2+ = alternate)
// ============================================================================

import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { BaseImporter } from "./base.importer.js";
import { RawPronunciation, PipelineModuleMetadata } from "../types/index.js";
import { ResourceRegistry } from "../registry/resource.registry.js";
import { logger } from "../utils/logger.js";

/**
 * Regex to detect alternate pronunciation suffix.
 * Matches: word(2), word(3), etc.
 * Captures: [1] = base word, [2] = variant number
 */
const VARIANT_REGEX = /^(.+)\((\d+)\)$/;

export class CmudictImporter extends BaseImporter<RawPronunciation> {
  readonly name = "cmudict.dict";
  readonly metadata: PipelineModuleMetadata = {
    id: "importer.cmudict",
    name: "CMU Dict Importer",
    version: "1.0.0",
    stage: "import",
    priority: 20,
    requiresModules: [],
    requiresFeatures: [],
    producesFeatures: [],
    author: "LexForge",
  };

  async *import(): AsyncGenerator<RawPronunciation, void, unknown> {
    const resource = ResourceRegistry.get("resource.cmudict");
    ResourceRegistry.markLoaded(resource.id);
    const filePath = resource.path;

    logger.info(`Streaming ${this.name} from: ${filePath}`);

    const fileStream = createReadStream(filePath, { encoding: "utf-8" });
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineNumber = 0;
    let errorCount = 0;

    for await (const rawLine of rl) {
      lineNumber++;
      let line = rawLine.trim();

      // Skip empty lines
      if (line.length === 0) {
        continue;
      }

      // Skip comment lines (;;; prefix)
      if (line.startsWith(";;;")) {
        continue;
      }

      // Strip inline comments (everything after #)
      const commentIndex = line.indexOf("#");
      if (commentIndex !== -1) {
        line = line.substring(0, commentIndex).trim();
      }

      // Split on first whitespace to separate word from pronunciation
      const firstSpaceIndex = line.indexOf(" ");
      if (firstSpaceIndex === -1) {
        logger.warn(`Line ${lineNumber}: No pronunciation found — "${rawLine.trim()}"`);
        errorCount++;
        continue;
      }

      const rawWord = line.substring(0, firstSpaceIndex);
      const arpabet = line.substring(firstSpaceIndex + 1).trim();

      if (arpabet.length === 0) {
        logger.warn(`Line ${lineNumber}: Empty pronunciation for "${rawWord}"`);
        errorCount++;
        continue;
      }

      // Detect alternate pronunciations: word(2), word(3), etc.
      let word = rawWord;
      let variant = 1;

      const variantMatch = VARIANT_REGEX.exec(rawWord);
      if (variantMatch) {
        word = variantMatch[1];
        variant = parseInt(variantMatch[2], 10);
      }

      yield { word, arpabet, variant };
    }

    if (errorCount > 0) {
      logger.warn(`${errorCount} parse errors encountered in ${this.name}`);
    }
  }
}
