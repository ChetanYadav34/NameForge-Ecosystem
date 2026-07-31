// ============================================================================
// LexForge Dataset Compiler — IPA to Phonology Transformer
// ============================================================================
// Parses IPA strings into structured phonological data:
//   • Phoneme extraction (including multi-character phonemes)
//   • Vowel / Consonant classification
//   • Stress pattern extraction
//   • Lossless unknown symbol preservation
// ============================================================================

import { BaseTransformer } from "./base.transformer.js";
import { TransformedWord, PhonologyWord, TransformResult, PipelineModuleMetadata } from "../types/index.js";
import { logger } from "../utils/logger.js";
import {
  IPA_VOWELS,
  IPA_CONSONANTS,
  VOWEL_SET,
  CONSONANT_SET,
  IPA_STRESS_MARKERS,
} from "../constants/ipa.js";

// Ordered list of all phonemes (longest first for greedy matching)
const ALL_PHONEMES_ORDERED = [...IPA_VOWELS, ...IPA_CONSONANTS].sort((a, b) => b.length - a.length);

interface PhonologyParseResult {
  phonemes: string[];
  vowels: string[];
  consonants: string[];
  stressPattern: string;
  unknownSymbols: string[];
}

/**
 * Parse an IPA string into structured phonological data.
 */
function parseIpa(ipa: string): PhonologyParseResult {
  const result: PhonologyParseResult = {
    phonemes: [],
    vowels: [],
    consonants: [],
    stressPattern: "",
    unknownSymbols: [],
  };

  let currentStress = "0";
  let pos = 0;

  while (pos < ipa.length) {
    // 1. Check for stress markers
    if (ipa[pos] === IPA_STRESS_MARKERS.PRIMARY) {
      currentStress = "1";
      pos++;
      continue;
    }
    if (ipa[pos] === IPA_STRESS_MARKERS.SECONDARY) {
      currentStress = "2";
      pos++;
      continue;
    }

    // 2. Greedy match against known phonemes
    let matched = false;
    for (const phoneme of ALL_PHONEMES_ORDERED) {
      if (ipa.startsWith(phoneme, pos)) {
        result.phonemes.push(phoneme);

        if (VOWEL_SET.has(phoneme)) {
          result.vowels.push(phoneme);
          result.stressPattern += currentStress;
          currentStress = "0"; // Reset stress after consuming it for a vowel
        } else if (CONSONANT_SET.has(phoneme)) {
          result.consonants.push(phoneme);
          // Stress remains active for the upcoming vowel
        }

        pos += phoneme.length;
        matched = true;
        break;
      }
    }

    // 3. Handle unknown symbols (lossless preservation)
    if (!matched) {
      const char = ipa[pos];
      result.phonemes.push(char);
      result.unknownSymbols.push(char);
      pos++;
    }
  }

  return result;
}

export class IpaToPhonologyTransformer extends BaseTransformer<TransformedWord, PhonologyWord> {
  readonly name = "IPA → Phonology";
  readonly metadata: PipelineModuleMetadata = {
    id: "transformer.ipaToPhonology",
    name: "IPA to Phonology Transformer",
    version: "1.0.0",
    stage: "transform",
    priority: 40,
    requiresModules: ["transformer.arpabetToIpa"],
    requiresFeatures: ["feature.ipa"],
    producesFeatures: ["feature.phonology"],
    author: "LexForge",
  };

  transform(records: TransformedWord[]): TransformResult<PhonologyWord> {
    logger.info("Parsing IPA into phonological structures...");

    const output: PhonologyWord[] = [];
    const allWarnings: string[] = [];
    let transformedCount = 0;
    let skippedCount = 0;
    let totalUnknowns = 0;

    for (const record of records) {
      if (record.ipa.length === 0) {
        skippedCount++;
        output.push({
          ...record,
          phonemes: [],
          vowels: [],
          consonants: [],
          stressPattern: "",
          phonemeCount: 0,
          vowelCount: 0,
          consonantCount: 0,
          unknownSymbols: [],
        });
        continue;
      }

      const parseResult = parseIpa(record.ipa);

      if (parseResult.unknownSymbols.length > 0) {
        totalUnknowns += parseResult.unknownSymbols.length;
        for (const unk of parseResult.unknownSymbols) {
          allWarnings.push(`${record.word}: Unknown IPA symbol "${unk}" preserved in stream.`);
        }
      }

      transformedCount++;
      output.push({
        ...record,
        phonemes: parseResult.phonemes,
        vowels: parseResult.vowels,
        consonants: parseResult.consonants,
        stressPattern: parseResult.stressPattern,
        phonemeCount: parseResult.phonemes.length,
        vowelCount: parseResult.vowels.length,
        consonantCount: parseResult.consonants.length,
        unknownSymbols: parseResult.unknownSymbols,
      });
    }

    logger.success(`Extracted phonology for ${transformedCount.toLocaleString()} words`);
    if (skippedCount > 0) {
      logger.stat("Skipped (no IPA)", skippedCount.toLocaleString());
    }

    if (allWarnings.length > 0) {
      logger.warn(`${totalUnknowns.toLocaleString()} unknown IPA symbol(s) encountered`);
      const previewCount = Math.min(allWarnings.length, 5);
      for (let i = 0; i < previewCount; i++) {
        logger.info(`  ${allWarnings[i]}`);
      }
      if (allWarnings.length > previewCount) {
        logger.info(`  ... and ${allWarnings.length - previewCount} more`);
      }
    }

    return {
      records: output,
      transformedCount,
      skippedCount,
      warnings: allWarnings,
    };
  }
}
