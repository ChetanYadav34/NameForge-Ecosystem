import { ConfidenceRule, CandidateTerm } from "../types";

export class MultiProviderRule implements ConfidenceRule {
  id = "rule:multi-provider";
  name = "Multi-Provider Bonus Rule";

  evaluate(candidate: CandidateTerm): number {
    const uniqueProviders = new Set<string>();
    
    for (const ev of candidate.evidence) {
      uniqueProviders.add(ev.provider);
    }

    if (uniqueProviders.size >= 3) {
      return 0.3; // +0.3 bonus for strong multi-provider consensus
    } else if (uniqueProviders.size === 2) {
      return 0.15; // +0.15 bonus for 2 providers
    }

    return 0.0;
  }
}
