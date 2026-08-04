import { DiversifiedCandidateBatch, DiversifiedCandidate } from "../diversification/types";
export type { DiversifiedCandidateBatch, DiversifiedCandidate };
import { GenerationPlan } from "../strategy/types";
import { ValidatedBlueprint } from "../validation/types";

export interface SelectionReason {
  ruleId: string;
  message: string;
  details?: Record<string, any>;
}

export interface SelectionDecision {
  selected: boolean;
  reasons: SelectionReason[];
}

export interface SelectedCandidate {
  diversifiedCandidate: DiversifiedCandidate;
  decision: SelectionDecision;
}

export interface SelectionSummary {
  selectedCount: number;
  rejectedCount: number;
  clustersRepresented: number;
  averageRank: number;
  averageCompositeScore: number;
  averageDiversityScore: number;
  strategyUsed: string;
}

export interface SelectedCandidateBatch {
  id: string;
  sourceBatchId: string;
  candidates: SelectedCandidate[];
  summary: SelectionSummary;
  selectedAt: string;
}

export interface SelectionContext {
  plan: GenerationPlan;
  blueprint: ValidatedBlueprint;
}

export interface SelectionStrategy {
  id: string;
  name: string;
  select(batch: DiversifiedCandidateBatch, context: SelectionContext): SelectedCandidate[];
}
