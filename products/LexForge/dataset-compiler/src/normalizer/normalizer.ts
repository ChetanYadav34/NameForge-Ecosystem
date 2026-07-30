// ============================================================================
// LexForge Dataset Compiler — Normalizer
// ============================================================================
// Cleans and normalizes imported data before merging.
//
// Responsibilities:
//   • Lowercase all words
//   • Trim whitespace
//   • Deduplicate the word list
//   • Build pronunciation maps (primary + alternates) from raw pronunciations
//
// Produces NormalizedWord objects rather than plain strings.
// ============================================================================

import { RawWord, RawPronunciation, NormalizedData, NormalizedWord } from "../types/index.js";
import { logger } from "../utils/logger.js";

/**
 * Normalize imported words and pronunciations into a clean, deduplicated
 * structure ready for merging.
 *
 * @param rawWords - Raw words imported from the word list source.
 * @param rawPronunciations - Raw pronunciations imported from the pronunciation dictionary.
 * @returns Normalized data with deduplicated words and organized pronunciation maps.
 */
export function normalize(
  rawWords: RawWord[],
  rawPronunciations: RawPronunciation[]
): NormalizedData {
  // --- Normalize and deduplicate word list ---
  logger.info("Normalizing word list...");

  const wordSet = new Set<string>();
  let duplicatesRemoved = 0;

  for (const entry of rawWords) {
    const normalized = entry.word.trim().toLowerCase();

    if (normalized.length === 0) {
      continue;
    }

    if (wordSet.has(normalized)) {
      duplicatesRemoved++;
      continue;
    }

    wordSet.add(normalized);
  }

  // Convert to sorted NormalizedWord array for deterministic output
  const words: NormalizedWord[] = Array.from(wordSet)
    .sort()
    .map((w) => ({ word: w }));

  logger.success(`${words.length.toLocaleString()} unique words after normalization`);

  if (duplicatesRemoved > 0) {
    logger.info(`${duplicatesRemoved.toLocaleString()} duplicate(s) removed`);
  }

  // --- Build pronunciation maps ---
  logger.info("Building pronunciation maps...");

  const pronunciations = new Map<string, string>();
  const alternatePronunciations = new Map<string, string[]>();

  for (const entry of rawPronunciations) {
    const word = entry.word.trim().toLowerCase();

    if (entry.variant === 1) {
      // Primary pronunciation — only store the first one seen
      if (!pronunciations.has(word)) {
        pronunciations.set(word, entry.arpabet);
      }
    } else {
      // Alternate pronunciation
      const existing = alternatePronunciations.get(word) || [];
      existing.push(entry.arpabet);
      alternatePronunciations.set(word, existing);
    }
  }

  logger.success(
    `${pronunciations.size.toLocaleString()} primary pronunciations indexed`
  );

  const totalAlternates = Array.from(alternatePronunciations.values()).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  logger.info(
    `${totalAlternates.toLocaleString()} alternate pronunciations preserved`
  );

  return {
    words,
    pronunciations,
    alternatePronunciations,
    duplicatesRemoved,
  };
}
