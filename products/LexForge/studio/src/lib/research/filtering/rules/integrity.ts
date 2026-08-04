import { EvaluatedCandidate, FilteringContext, FilterRule, FilterReason } from "../types";

export class BlueprintComplianceFilter implements FilterRule {
  id = "filter:blueprint_compliance";
  name = "Blueprint Compliance Filter";

  evaluate(candidate: EvaluatedCandidate, context: FilteringContext): FilterReason | null {
    return null;
  }
}

export class TraceabilityFilter implements FilterRule {
  id = "filter:traceability";
  name = "Traceability Filter";

  evaluate(candidate: EvaluatedCandidate, context: FilteringContext): FilterReason | null {
    const isTraceable = candidate.candidate.fragments.every(f => f.instruction !== undefined);
    if (!isTraceable) {
      return {
        ruleId: this.id,
        message: "Candidate lacks traceability evidence."
      };
    }
    return null;
  }
}

export class DuplicateCandidateFilter implements FilterRule {
  id = "filter:duplicate_candidate";
  name = "Duplicate Candidate Filter";

  evaluate(candidate: EvaluatedCandidate, context: FilteringContext): FilterReason | null {
    // In reality, this requires cross-candidate state, which breaks statelessness slightly.
    // For now, it's a mock.
    return null;
  }
}
