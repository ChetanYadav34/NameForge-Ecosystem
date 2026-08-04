import { RankedCandidateBatch, RankedCandidate } from "../ranking/types";
export type { RankedCandidateBatch, RankedCandidate };
import { GenerationPlan } from "../strategy/types";
import { ValidatedBlueprint } from "../validation/types";

export interface SimilarityMetric {
  analyzerId: string;
  score: number;
}

export interface SimilarityCluster {
  id: string;
  representative: RankedCandidate;
  members: RankedCandidate[];
  similarityScore: number;
  diversityScore: number;
}

export interface DiversifiedCandidate {
  cluster: SimilarityCluster;
  rankedCandidate: RankedCandidate; // The original candidate
  isRepresentative: boolean;
}

export interface DiversificationSummary {
  clusterCount: number;
  largestCluster: number;
  averageClusterSize: number;
  averageSimilarity: number;
  diversityScore: number;
  strategyUsed: string;
}

export interface DiversifiedCandidateBatch {
  id: string;
  sourceBatchId: string;
  candidates: DiversifiedCandidate[];
  clusters: SimilarityCluster[];
  summary: DiversificationSummary;
  diversifiedAt: string;
}

export interface DiversificationContext {
  plan: GenerationPlan;
  blueprint: ValidatedBlueprint;
}

export interface SimilarityAnalyzer {
  id: string;
  name: string;
  calculateSimilarity(c1: RankedCandidate, c2: RankedCandidate, context: DiversificationContext): number;
}

export interface DiversificationStrategy {
  id: string;
  name: string;
  cluster(batch: RankedCandidateBatch, analyzers: SimilarityAnalyzer[], context: DiversificationContext): SimilarityCluster[];
}
