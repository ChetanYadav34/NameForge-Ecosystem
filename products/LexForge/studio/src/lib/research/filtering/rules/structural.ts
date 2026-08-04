import { EvaluatedCandidate, FilteringContext, FilterRule, FilterReason } from "../types";

export class StructuralIntegrityFilter implements FilterRule {
  id = "filter:structural_integrity";
  name = "Structural Integrity Filter";

  evaluate(candidate: EvaluatedCandidate, context: FilteringContext): FilterReason | null {
    return null;
  }
}

export class LengthConstraintFilter implements FilterRule {
  id = "filter:length_constraint";
  name = "Length Constraint Filter";

  evaluate(candidate: EvaluatedCandidate, context: FilteringContext): FilterReason | null {
    const len = candidate.candidate.value.length;
    const targets = context.plan.targets.lengthTarget;
    if (len < targets.min || len > targets.max) {
      return {
        ruleId: this.id,
        message: "Candidate length out of bounds.",
        details: { length: len, target: targets }
      };
    }
    return null;
  }
}

export class SyllableConstraintFilter implements FilterRule {
  id = "filter:syllable_constraint";
  name = "Syllable Constraint Filter";

  evaluate(candidate: EvaluatedCandidate, context: FilteringContext): FilterReason | null {
    return null;
  }
}

export class ForbiddenClusterFilter implements FilterRule {
  id = "filter:forbidden_cluster";
  name = "Forbidden Cluster Filter";

  evaluate(candidate: EvaluatedCandidate, context: FilteringContext): FilterReason | null {
    return null;
  }
}
