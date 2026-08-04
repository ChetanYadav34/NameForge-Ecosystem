import { Pattern, CategoryDNA } from "../dna/types";

export interface PatternAssessment {
  analyzerId: string;
  importanceContribution: number;
  stabilityContribution: number;
  diversityContribution: number;
  evidenceStrength: number;
  confidenceContribution: number;
  explanation: string;
  supportingEvidence: string[];
}

export interface AggregatedScores {
  importance: number;
  stability: number;
  diversity: number;
  evidenceQuality: number;
  confidence: number;
}

export type PatternClassification = "core" | "dominant" | "supporting" | "rare" | "noise" | string;

export interface SignaturePattern {
  originalPattern: Pattern;
  assessments: PatternAssessment[];
  aggregatedScores: AggregatedScores;
  normalizedScores: AggregatedScores;
  classification: PatternClassification;
  explanation: string;
  supportingWords: string[];
  evidenceSummary: string;
}

export interface CategorySignature {
  seed: string;
  sourceDnaVersion: string;
  classifiedPatterns: {
    orthographic: SignaturePattern[];
    phonetic: SignaturePattern[];
    morphological: SignaturePattern[];
    structural: SignaturePattern[];
    frequency: SignaturePattern[];
    semantic: SignaturePattern[];
    transition: SignaturePattern[];
  };
  generatedAt: string;
  metadata: Record<string, any>;
}

export interface IntelligenceAnalyzer {
  id: string;
  name: string;
  analyze(pattern: Pattern, context: CategoryDNA): PatternAssessment;
}

export interface ClassificationStrategy {
  id: string;
  name: string;
  classify(scores: AggregatedScores): PatternClassification;
}
