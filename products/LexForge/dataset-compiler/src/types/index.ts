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

// ─── Registry Types ────────────────────────────────────────────────────────────

export type PipelineStage = "import" | "normalize" | "merge" | "transform" | "enrich" | "engine" | "validate" | "build" | "export";

export interface PipelineModuleMetadata {
  id: string;
  name: string;
  version: string;
  stage: PipelineStage;
  priority: number;
  requiresModules: string[];
  requiresFeatures: string[];
  producesFeatures: string[];
  author: string;
}

export interface PipelineModule {
  metadata: PipelineModuleMetadata;
}

export type FeatureCategory = "base" | "phonology" | "semantics" | "morphology" | "frequency" | "category" | "cluster" | "research";

export interface FeatureDefinition {
  id: string;
  displayName: string;
  description: string;
  category: FeatureCategory;
  stage: PipelineStage;
  generatedBy: string; // Module ID
  requiresFeatures: string[];
  producesFeatures: string[];
  outputFields: string[];
  schemaVersion: number;
}

// ─── Pipeline Stage Models ───────────────────────────────────────────────────

/**
 * A single entry in the master dataset (final output schema).
 *
 * Version 3 populates: id, word, lemma, arpabet, alternatePronunciations, ipa, length,
 * phonemes, vowels, consonants, stressPattern, phonemeCount, vowelCount, consonantCount.
 * Version 4 populates: partOfSpeech, definitions, synonyms, antonyms, hypernyms, hyponyms, domains, sources.
 * Future versions will populate: syllables, categories.
 */
  export interface FrequencyInfo {
    zipf: number;
    band: "very-common" | "common" | "uncommon" | "rare" | "very-rare";
    source: string;
    externalRank?: number;
    externalPercentile?: number;
    lexforgeRank?: number;
    lexforgePercentile?: number;
  }
  
  export interface LexEntry {
    id: number;
    word: string;
    lemma?: string;
    stem?: string;
    inflections: string[];
    derivations: string[];
    familyId?: string;
    headword?: string;
    wordFamily: string[];
    familySize: number;
    familyConfidence: number;
    frequency?: FrequencyInfo;
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
    partOfSpeech: string[];
    definitions: string[];
    synonyms: string[];
    antonyms: string[];
    hypernyms: string[];
    hyponyms: string[];
    domains: string[];
    sources: string[];
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

/**
 * A word enriched with semantic knowledge from WordNet.
 * Produced by the WordNet enricher.
 */
export interface SemanticWord extends PhonologyWord {
  partOfSpeech: string[];
  definitions: string[];
  synonyms: string[];
  antonyms: string[];
  hypernyms: string[];
  hyponyms: string[];
  domains: string[];
  sources: string[];
}

export interface MorphologyWord extends SemanticWord {
  lemma?: string;
  stem?: string;
  inflections: string[];
  derivations: string[];
}

export interface FamilyWord extends MorphologyWord {
  familyId?: string;
  headword?: string;
  wordFamily: string[];
  familySize: number;
  familyConfidence: number;
}

export interface FrequencyWord extends MorphologyWord {
  frequency?: FrequencyInfo;
}

export interface FinalWord extends FamilyWord {
  frequency?: FrequencyInfo;
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
  wordsWithDefinitions: number;
  wordsWithSynonyms: number;
  wordsWithHypernyms: number;
  wordsWithHyponyms: number;
  averageDefinitionsPerWord: number;
  averageSynonymsPerWord: number;
  averageHypernymsPerWord: number;
  averageHyponymsPerWord: number;
  wordsWithMorphology: number;
  totalInflectionsGenerated: number;
  totalDerivationsGenerated: number;
  totalFamilies: number;
  averageFamilySize: number;
  largestFamily: number;
  singletonFamilies: number;
  averageFamilyConfidence: number;
  
  // Frequency Stats
  wordsWithFrequency: number;
  missingFrequency: number;
  coveragePercentage: number;
  averageZipf: number;
  medianZipf: number;
  highestZipf: number;
  lowestZipf: number;
  frequencyBandDistribution: Record<string, number>;
  top100MostCommonWords: string[];
  
  warnings: number;
}

/**
 * Resource format types.
 */
export type ResourceFormat = "json" | "jsonl" | "txt" | "csv" | "sqlite";

/**
 * Resource type categories.
 */
export type ResourceType =
  | "dictionary"
  | "pronunciation"
  | "semantic"
  | "morphology"
  | "frequency"
  | "variants"
  | "knowledge-graph";

/**
 * Resource state enum.
 */
export enum ResourceState {
  REGISTERED = "REGISTERED",
  VALIDATED = "VALIDATED",
  LOADED = "LOADED",
  FAILED = "FAILED",
}

/**
 * Represents an external resource dataset consumed by LexForge.
 */
export interface ResourceDefinition {
  id: string;
  name: string;
  version: string;
  description: string;
  provider: string;
  language: string;
  format: ResourceFormat;
  resourceType: ResourceType;
  path: string;
  homepage?: string;
  size?: number;
  checksum?: string;
  license?: string;
  lastUpdated?: string;
  consumedBy: string[];
  provides: string[];
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
  features: string[];
  pipelineStages: string[];
  enabledEnrichers: string[];
  enabledTransformers: string[];
  enabledValidators: string[];
  resources: ResourceDefinition[];
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
