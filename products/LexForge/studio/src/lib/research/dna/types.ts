import { CategoryKnowledge } from "../types";

export interface Pattern {
  id: string;
  value: string | number;
  frequency: number;
  coverage: number;       // e.g., 0.72 for 72% of vocabulary
  confidence: number;     // optional confidence score, usually derived from evidence
  supportingWords: string[];
  evidenceCount: number;
  metadata: Record<string, any>;
}

export interface OrthographicDNA {
  letterFrequencies: Pattern[];
  characterNGrams: Pattern[];
  prefixes: Pattern[];
  suffixes: Pattern[];
  infixes: Pattern[];
  beginningClusters: Pattern[];
  endingClusters: Pattern[];
}

export interface PhoneticDNA {
  ipaInventory: Pattern[];
  phonemeFrequencies: Pattern[];
  onsetClusters: Pattern[];
  codaClusters: Pattern[];
  stressPatterns: Pattern[];
  syllableStructures: Pattern[];
}

export interface MorphologicalDNA {
  roots: Pattern[];
  stems: Pattern[];
  affixes: Pattern[];
  productiveMorphology: Pattern[];
  stemFamilies: Pattern[];
}

export interface StructuralDNA {
  wordLengths: Pattern[];
  syllableCounts: Pattern[];
  cvStructures: Pattern[];
  consonantVowelDistributions: Pattern[];
}

export interface FrequencyDNA {
  zipfDistributions: Pattern[];
  rarityBands: Pattern[];
  commonVsRare: Pattern[];
  statisticalDistributions: Pattern[];
}

export interface SemanticDNA {
  posDistributions: Pattern[];
  taxonomyDistributions: Pattern[];
  relationshipDistributions: Pattern[];
  lexicalClassRatios: Pattern[];
}

export interface TransitionDNA {
  letterTransitions: Pattern[];
  phonemeTransitions: Pattern[];
  onsetTransitions: Pattern[];
  codaTransitions: Pattern[];
}

export interface CategoryDNA {
  seed: string;
  sourceKnowledgeVersion: string;
  orthographic: OrthographicDNA;
  phonetic: PhoneticDNA;
  morphological: MorphologicalDNA;
  structural: StructuralDNA;
  frequency: FrequencyDNA;
  semantic: SemanticDNA;
  transition: TransitionDNA;
  generatedAt: string;
  metadata: Record<string, any>;
}

export interface DNAAnalyzer<TDnaFragment> {
  id: string;
  name: string;
  analyze(knowledge: CategoryKnowledge): TDnaFragment;
}

export interface BaselineProvider {
  id: string;
  name: string;
  getBaselineFrequency(trait: string, value: string): Promise<number>;
}
