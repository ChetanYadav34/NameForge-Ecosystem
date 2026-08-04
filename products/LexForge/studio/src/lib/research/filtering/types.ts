import { EvaluatedCandidateBatch, EvaluatedCandidate } from "../evaluation/types";
export type { EvaluatedCandidateBatch, EvaluatedCandidate };
import { GenerationPlan } from "../strategy/types";
import { ValidatedBlueprint } from "../validation/types";

export interface FilterReason {
  ruleId: string;
  message: string;
  details?: Record<string, any>;
}

export interface FilterDecision {
  accepted: boolean;
  reasons: FilterReason[];
  triggeredRules: string[];
}

export interface FilteredCandidate {
  evaluatedCandidate: EvaluatedCandidate;
  decision: FilterDecision;
}

export interface FilteringSummary {
  acceptedCount: number;
  rejectedCount: number;
  acceptanceRate: number;
  rejectionReasons: Record<string, number>;
  ruleStatistics: Record<string, number>;
}

export interface FilteredCandidateBatch {
  id: string;
  sourceBatchId: string;
  candidates: FilteredCandidate[];
  summary: FilteringSummary;
  filteredAt: string;
}

export interface FilteringContext {
  plan: GenerationPlan;
  blueprint: ValidatedBlueprint;
}

export interface FilterRule {
  id: string;
  name: string;
  evaluate(candidate: EvaluatedCandidate, context: FilteringContext): FilterReason | null;
}
