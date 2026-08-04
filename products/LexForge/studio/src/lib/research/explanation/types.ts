import { SelectedCandidateBatch, SelectedCandidate } from "../selection/types";
export type { SelectedCandidateBatch, SelectedCandidate };
import { GenerationPlan } from "../strategy/types";
import { ValidatedBlueprint } from "../validation/types";

export interface ExplanationEvidence {
  sourceId: string;
  type: string;
  description: string;
}

export interface ExplanationSection {
  title: string;
  points: string[];
  evidence: ExplanationEvidence[];
}

export interface CandidateExplanation {
  sections: ExplanationSection[];
  confidenceScore: number;
  evidenceDepth: number;
  supportingRules: number;
  supportingPatterns: number;
}

export interface ExplainedCandidate {
  selectedCandidate: SelectedCandidate;
  explanation: CandidateExplanation;
}

export interface ExplanationSummary {
  averageConfidence: number;
  averageEvidenceDepth: number;
  averageSupportingRules: number;
  averageSupportingPatterns: number;
}

export interface ExplainedCandidateBatch {
  id: string;
  sourceBatchId: string;
  candidates: ExplainedCandidate[];
  summary: ExplanationSummary;
  explainedAt: string;
}

export interface ExplanationContext {
  plan: GenerationPlan;
  blueprint: ValidatedBlueprint;
}

export interface ExplanationBuilder {
  id: string;
  name: string;
  build(candidate: SelectedCandidate, context: ExplanationContext, existingExplanation: CandidateExplanation): void;
}
