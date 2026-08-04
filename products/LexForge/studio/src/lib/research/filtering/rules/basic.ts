import { EvaluatedCandidate, FilteringContext, FilterRule, FilterReason } from "../types";

export class MinimumCompositeScoreFilter implements FilterRule {
  id = "filter:min_composite_score";
  name = "Minimum Composite Score Filter";

  evaluate(candidate: EvaluatedCandidate, context: FilteringContext): FilterReason | null {
    // For example, if we need at least 0.5 composite score
    if (candidate.evaluation.compositeScore < 0.5) {
      return {
        ruleId: this.id,
        message: "Candidate composite score is too low.",
        details: { score: candidate.evaluation.compositeScore }
      };
    }
    return null;
  }
}

export class PronounceabilityThresholdFilter implements FilterRule {
  id = "filter:pronounceability_threshold";
  name = "Pronounceability Threshold Filter";

  evaluate(candidate: EvaluatedCandidate, context: FilteringContext): FilterReason | null {
    // Mock check
    return null;
  }
}

export class DomainConstraintFilter implements FilterRule {
  id = "filter:domain_constraint";
  name = "Domain Constraint Filter";

  evaluate(candidate: EvaluatedCandidate, context: FilteringContext): FilterReason | null {
    // Mock check
    return null;
  }
}
