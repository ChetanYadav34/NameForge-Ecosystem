import { ResearchContext, ResearchPass, CandidateTerm, EvidenceRecord } from "../types";

export class CandidateBuilderPass implements ResearchPass {
  id = "pass:candidate-builder";
  name = "Candidate Builder Pass";
  priority = 400;

  async execute(context: ResearchContext): Promise<void> {
    const startTime = performance.now();
    
    const groupedEvidence = (context as any).groupedEvidence as Map<string, EvidenceRecord[]>;
    if (!groupedEvidence) {
      throw new Error("CandidateBuilderPass requires groupedEvidence from EvidenceMergePass");
    }

    let built = 0;

    for (const [term, evidence] of groupedEvidence.entries()) {
      const uniqueProviders = new Set(evidence.map(e => e.provider));
      
      const candidate: CandidateTerm = {
        term,
        evidence,
        confidenceBreakdown: { rulesApplied: {}, overallScore: 0 },
        overallConfidence: 0,
        rankingScore: 0,
        providerSummary: Array.from(uniqueProviders),
        status: "pending",
        metadata: {}
      };
      
      context.candidatePool.set(term, candidate);
      built++;
    }

    const duration = performance.now() - startTime;
    context.session.executionMetrics[this.id] = {
      durationMs: duration,
      candidatesBuilt: built
    };
    
    context.session.statistics["candidates_built"] = built;
  }
}
