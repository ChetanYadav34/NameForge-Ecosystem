import { SelectedCandidateBatch } from "../selection/types";
import { ValidatedBlueprint } from "../validation/types";
import { GenerationPlan } from "../strategy/types";
import {
  ExplanationContext,
  ExplanationSummary,
  CandidateExplanation,
  ExplainedCandidate,
  ExplainedCandidateBatch
} from "./types";
import { explanationBuilderRegistry } from "./registry";

export class CandidateExplanationEngine {
  explain(
    batch: SelectedCandidateBatch,
    plan: GenerationPlan,
    blueprint: ValidatedBlueprint
  ): ExplainedCandidateBatch {
    const context: ExplanationContext = { plan, blueprint };
    const builders = explanationBuilderRegistry.getAll();
    
    const explainedCandidates: ExplainedCandidate[] = [];

    let sumConfidence = 0;
    let sumEvidence = 0;
    let sumRules = 0;
    let sumPatterns = 0;

    for (const candidate of batch.candidates) {
      const explanation: CandidateExplanation = {
        sections: [],
        confidenceScore: 0.5, // Base mock
        evidenceDepth: 0,
        supportingRules: 0,
        supportingPatterns: 0
      };

      for (const builder of builders) {
        builder.build(candidate, context, explanation);
      }

      sumConfidence += explanation.confidenceScore;
      sumEvidence += explanation.evidenceDepth;
      sumRules += explanation.supportingRules;
      sumPatterns += explanation.supportingPatterns;

      explainedCandidates.push({
        selectedCandidate: candidate,
        explanation
      });
    }

    const count = explainedCandidates.length;

    const summary: ExplanationSummary = {
      averageConfidence: count > 0 ? sumConfidence / count : 0,
      averageEvidenceDepth: count > 0 ? sumEvidence / count : 0,
      averageSupportingRules: count > 0 ? sumRules / count : 0,
      averageSupportingPatterns: count > 0 ? sumPatterns / count : 0
    };

    return Object.freeze({
      id: crypto.randomUUID(),
      sourceBatchId: batch.id,
      candidates: explainedCandidates,
      summary,
      explainedAt: new Date().toISOString()
    });
  }
}

export const explanationEngine = new CandidateExplanationEngine();
