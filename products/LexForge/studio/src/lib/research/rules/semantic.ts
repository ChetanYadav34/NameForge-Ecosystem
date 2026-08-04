import { ConfidenceRule, CandidateTerm } from "../types";

export class SemanticRelationRule implements ConfidenceRule {
  id = "rule:semantic-relation";
  name = "Semantic Relation Rule";

  evaluate(candidate: CandidateTerm): number {
    let score = 0;
    
    // Check if there is any WordNet evidence
    for (const ev of candidate.evidence) {
      if (ev.provider === "provider:wordnet") {
        if (ev.relation === "synonym") {
          score = Math.max(score, 0.9);
        } else if (ev.relation === "hypernym" || ev.relation === "hyponym") {
          score = Math.max(score, 0.8);
        }
      }
    }

    return score;
  }
}
