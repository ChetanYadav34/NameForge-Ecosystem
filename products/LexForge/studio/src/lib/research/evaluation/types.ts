import { CandidateBatch, Candidate } from "../generation/types";
export type { CandidateBatch, Candidate };
import { GenerationPlan } from "../strategy/types";
import { ValidatedBlueprint } from "../validation/types";

export interface EvaluationMetric {
  analyzerId: string;
  name: string;
  score: number; // 0.0 to 1.0
  details?: Record<string, any>;
}

export interface CandidateEvaluation {
  metrics: EvaluationMetric[];
  compositeScore: number;
}

export interface EvaluatedCandidate {
  candidate: Candidate;
  evaluation: CandidateEvaluation;
}

export interface EvaluationSummary {
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  metricAverages: Record<string, number>;
}

export interface EvaluatedCandidateBatch {
  id: string;
  sourceBatchId: string;
  candidates: EvaluatedCandidate[];
  summary: EvaluationSummary;
  evaluatedAt: string;
}

export interface EvaluationContext {
  plan: GenerationPlan;
  blueprint: ValidatedBlueprint;
}

export interface EvaluationAnalyzer {
  id: string;
  name: string;
  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric;
}
