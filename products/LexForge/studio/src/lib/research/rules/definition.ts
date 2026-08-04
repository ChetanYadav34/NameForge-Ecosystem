import { ConfidenceRule, CandidateTerm } from "../types";

export class DefinitionRule implements ConfidenceRule {
  id = "rule:definition";
  name = "Definition Rule";

  evaluate(candidate: CandidateTerm): number {
    let score = 0;
    
    let definitionMentions = 0;
    for (const ev of candidate.evidence) {
      if (ev.provider === "provider:definition" && ev.relation === "appears-in-definition") {
        definitionMentions++;
      }
    }

    if (definitionMentions > 0) {
      // Base score of 0.6, up to 0.75 for multiple mentions
      score = Math.min(0.6 + (definitionMentions * 0.05), 0.75);
    }

    return score;
  }
}
