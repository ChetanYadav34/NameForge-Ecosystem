// ============================================================================
// LexForge Dataset Compiler — Dataset Builder
// ============================================================================
// Transforms validated TransformedWord records into the final LexEntry schema.
//
// Version 2 populates:
//   id, word, lemma, arpabet, alternatePronunciations, ipa, length
//
// Future-version fields are initialized as empty:
//   phonemes, syllables, categories
// ============================================================================

import { PhonologyWord, LexEntry } from "../types/index.js";
import { logger } from "../utils/logger.js";

/**
 * Build the final dataset from validated phonology records.
 *
 * Each record is assigned a sequential ID starting at 1.
 * The lemma is set equal to the word (no lemmatization in current version).
 *
 * @param records - Validated phonology records.
 * @returns Array of complete LexEntry objects ready for export.
 */
export function buildDataset(records: PhonologyWord[]): LexEntry[] {
  logger.info("Building final dataset...");

  const entries: LexEntry[] = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];

    entries.push({
      id: i + 1,
      word: record.word,
      lemma: record.word, // lemma = word (no lemmatization yet)
      arpabet: record.arpabet,
      alternatePronunciations: record.alternatePronunciations,
      ipa: record.ipa,
      phonemes: record.phonemes,
      vowels: record.vowels,
      consonants: record.consonants,
      stressPattern: record.stressPattern,
      phonemeCount: record.phonemeCount,
      vowelCount: record.vowelCount,
      consonantCount: record.consonantCount,
      syllables: [],       // Future version
      categories: [],      // Future version
      length: record.word.length,
    });
  }

  logger.success(`Built ${entries.length.toLocaleString()} dataset entries`);

  return entries;
}
