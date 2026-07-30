// ============================================================================
// LexForge Dataset Compiler — Merger
// ============================================================================
// Merges the normalized word list with pronunciation data.
//
// words_alpha.txt is the canonical word list.
// cmudict data is only used to enrich words that exist in words_alpha.
// Words found only in cmudict are discarded.
// ============================================================================

import { NormalizedData, MergedWord } from "../types/index.js";
import { logger } from "../utils/logger.js";

/**
 * Merge normalized words with pronunciation data.
 *
 * For each word in the canonical word list:
 *   - If a primary pronunciation exists in cmudict → attach it
 *   - If alternate pronunciations exist → attach them
 *   - If no pronunciation exists → leave arpabet empty and alternatePronunciations empty
 *
 * @param data - The normalized data containing words and pronunciation maps.
 * @returns Array of merged records ready for transformation and validation.
 */
export function merge(data: NormalizedData): MergedWord[] {
  logger.info("Merging word list with pronunciation data...");

  const records: MergedWord[] = [];
  let withPronunciation = 0;
  let withoutPronunciation = 0;
  let withAlternates = 0;

  for (const normalized of data.words) {
    const word = normalized.word;
    const arpabet = data.pronunciations.get(word) || "";
    const alternates = data.alternatePronunciations.get(word) || [];

    if (arpabet.length > 0) {
      withPronunciation++;
    } else {
      withoutPronunciation++;
    }

    if (alternates.length > 0) {
      withAlternates++;
    }

    records.push({
      word,
      arpabet,
      alternatePronunciations: alternates,
    });
  }

  logger.success(
    `Merged ${records.length.toLocaleString()} records`
  );
  logger.stat("With pronunciation", withPronunciation.toLocaleString());
  logger.stat("Without pronunciation", withoutPronunciation.toLocaleString());
  logger.stat("With alternate pronunciations", withAlternates.toLocaleString());

  return records;
}
