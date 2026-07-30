// ============================================================================
// LexForge Dataset Compiler — Type Definitions
// ============================================================================
// All shared interfaces and types used across the compilation pipeline.
// This is the single source of truth for data shapes in the compiler.
//
// Pipeline data flow:
//   RawWord → NormalizedWord → MergedWord → TransformedWord → PhonologyWord → LexEntry
//
// Each pipeline stage creates a NEW object rather than mutating the previous.
// ============================================================================

// ─── Pipeline Stage Models ───────────────────────────────────────────────────

/**
 * A single entry in the master dataset (final output schema).
 *
 * Version 3 populates: id, word, lemma, arpabet, alternatePronunciations, ipa, length,
 * phonemes, vowels, consonants, stressPattern, phonemeCount, vowelCount, consonantCount.
 * Future versions will populate: syllables, categories.
 */
export interface LexEntry {
  id: number;
  word: string;
  lemma: string;
  arpabet: string;
  alternatePronunciations: string[];
  ipa: string;
  phonemes: string[];
  vowels: string[];
  consonants: string[];
  stressPattern: string;
  phonemeCount: number;
  vowelCount: number;
  consonantCount: number;
  syllables: string[];
  categories: string[];
  length: number;
}

/**
 * Raw word imported from a word list source (e.g., words_alpha.txt).
 * This is the entry point of the pipeline — no processing has occurred.
 */
export interface RawWord {
  word: string;
}

/**
 * A word that has been cleaned and normalized.
 * Produced by the normalizer after lowercasing, trimming, and deduplication.
 */
export interface NormalizedWord {
  word: string;
}

/**
 * Raw pronunciation imported from a pronunciation dictionary (e.g., cmudict.dict).
 * Variant 1 is the primary pronunciation; 2+ are alternates.
 */
export interface RawPronunciation {
  word: string;
  arpabet: string;
  variant: number;
}

/**
 * A word merged with its pronunciation data.
 * Produced by the merger after joining the word list with pronunciation maps.
 */
export interface MergedWord {
  word: string;
  arpabet: string;
  alternatePronunciations: string[];
}

/**
 * A word that has been through all transformation stages.
 * Produced by transformers (e.g., ARPABET→IPA) after enriching merged data.
 */
export interface TransformedWord {
  word: string;
  arpabet: string;
  alternatePronunciations: string[];
  ipa: string;
}

/**
 * A word enriched with phonological parsing.
 * Produced by the IPA → Phonology transformer.
 */
export interface PhonologyWord {
  word: string;
  arpabet: string;
  alternatePronunciations: string[];
  ipa: string;
  phonemes: string[];
  vowels: string[];
  consonants: string[];
  stressPattern: string;
  phonemeCount: number;
  vowelCount: number;
  consonantCount: number;
  unknownSymbols: string[];
}

// ─── Importer Types ──────────────────────────────────────────────────────────

/**
 * Result returned by every importer.
 * Generic over the type of data imported.
 */
export interface ImportResult<T> {
  source: string;
  recordCount: number;
  data: T[];
  errors: string[];
}

// ─── Normalizer Types ────────────────────────────────────────────────────────

/**
 * Normalized and cleaned data ready for merging.
 * Words is a deduplicated list.
 * Pronunciations maps each word to its primary ARPABET string.
 * AlternatePronunciations maps each word to an array of alternate ARPABET strings.
 */
export interface NormalizedData {
  words: NormalizedWord[];
  pronunciations: Map<string, string>;
  alternatePronunciations: Map<string, string[]>;
  duplicatesRemoved: number;
}

// ─── Transformer Types ───────────────────────────────────────────────────────

/**
 * Result returned by a transformer after processing a batch of records.
 */
export interface TransformResult<T> {
  records: T[];
  transformedCount: number;
  skippedCount: number;
  warnings: string[];
}

// ─── Validator Types ─────────────────────────────────────────────────────────

/**
 * A single validation warning for a specific word.
 */
export interface ValidationWarning {
  word: string;
  rule: string;
  issue: string;
}

/**
 * Full validation report produced by the validator.
 */
export interface ValidationReport {
  totalRecords: number;
  validRecords: number;
  warnings: ValidationWarning[];
}

// ─── Output Types ────────────────────────────────────────────────────────────

/**
 * Statistics written to stats.json alongside the dataset.
 */
export interface DatasetStats {
  compilerVersion: string;
  generatedAt: string;
  totalWords: number;
  wordsWithPronunciation: number;
  wordsWithoutPronunciation: number;
  wordsWithIpa: number;
  wordsWithPhonemes: number;
  averagePhonemeCount: number;
  averageVowelCount: number;
  averageConsonantCount: number;
  maxPhonemeCount: number;
  minPhonemeCount: number;
  mostCommonVowel: string | null;
  mostCommonConsonant: string | null;
  unknownIpaSymbols: number;
  duplicatesRemoved: number;
  warnings: number;
}

/**
 * Dataset manifest for compatibility verification.
 * Written to dataset.manifest.json alongside the dataset.
 */
export interface DatasetManifest {
  dataset: string;
  datasetVersion: string;
  compilerVersion: string;
  schemaVersion: string;
  generatedAt: string;
  sources: string[];
  records: number;
}

// ─── Configuration ───────────────────────────────────────────────────────────

/**
 * Pipeline configuration — controls input paths, output destination, and filenames.
 */
export interface CompilerConfig {
  wordsAlphaPath: string;
  cmudictPath: string;
  outputPath: string;
  outputFilename: string;
  statsFilename: string;
  manifestFilename: string;
  compilerVersion: string;
  datasetVersion: string;
  schemaVersion: string;
}
