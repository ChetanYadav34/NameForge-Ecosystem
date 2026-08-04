import { ConfidenceRule, CandidateTerm } from "../types";

export class MorphologyRule implements ConfidenceRule {
  id = "rule:morphology";
  name = "Morphology Rule";

  evaluate(candidate: CandidateTerm): number {
    let score = 0;
    
    for (const ev of candidate.evidence) {
      if (ev.provider === "provider:morphology") {
        if (ev.relation === "stem") {
          score = Math.max(score, 0.95);
        }
      }
    }

    return score;
  }
}
