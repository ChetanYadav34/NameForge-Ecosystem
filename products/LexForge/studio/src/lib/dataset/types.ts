export interface DatasetManifest {
  dataset: string;
  datasetVersion: string;
  compilerVersion: string;
  schemaVersion: string;
  indexVersion: string;
  generatedAt: string;
  generatedBy: string;
  sources: string[];
  records: number;
  features: string[];
  featureVersions: Record<string, string>;
  pipelineStages: string[];
  enabledEnrichers: string[];
  enabledTransformers: string[];
  enabledValidators: string[];
  resources: any[];
  resourceVersions: Record<string, string>;
  resourceChecksums: Record<string, string>;
  artifacts: {
    dataset: string;
    index: string;
    lookup: string;
    stats: string;
    graphIndex?: string;
  };
}

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
  
  // Index Stats
  indexSize: number;
  largestRecord: number;
  averageRecordSize: number;
  
  warnings: number;
}

export interface DatasetIndexEntry {
  id: number;
  word: string;
  offset: number;
  length: number;
  familyId?: string;
  zipf?: number;
  partOfSpeech: string[];
  sources: string[];
  hasIpa: boolean;
  hasMorphology: boolean;
  hasFrequency: boolean;
  hasWordNet: boolean;
  hasFamily: boolean;
  hasDefinitions: boolean;
}

export type DatasetLookup = Record<string, { id: number; offset: number }>;

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
