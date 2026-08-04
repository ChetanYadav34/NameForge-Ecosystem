import { ResearchContext, ResearchPass } from "../types";

export class CandidateRankingPass implements ResearchPass {
  id = "pass:candidate-ranking";
  name = "Candidate Ranking Pass";
  priority = 600;

  async execute(context: ResearchContext): Promise<void> {
    const startTime = performance.now();
    let ranked = 0;

    for (const candidate of context.candidatePool.values()) {
      // Ranking is importance-based.
      // Factors:
      // - number of distinct evidence records
      // - number of unique providers
      // - base confidence
      
      const evidenceCount = candidate.evidence.length;
      const providerCount = candidate.providerSummary.length;
      
      // Simple formula: base confidence scaled by evidence depth
      candidate.rankingScore = (candidate.overallConfidence * 10) + (evidenceCount * 2) + (providerCount * 5);
      ranked++;
    }

    const duration = performance.now() - startTime;
    context.session.executionMetrics[this.id] = {
      durationMs: duration,
      candidatesRanked: ranked
    };
  }
}
