import { ResearchContext, ResearchPass } from "../types";
import { confidenceRuleRegistry } from "../registry";

export class ConfidenceScoringPass implements ResearchPass {
  id = "pass:confidence-scoring";
  name = "Confidence Scoring Pass";
  priority = 500;

  async execute(context: ResearchContext): Promise<void> {
    const startTime = performance.now();
    const rules = confidenceRuleRegistry.getAll();
    
    let scored = 0;

    for (const candidate of context.candidatePool.values()) {
      let overall = 0;
      
      for (const rule of rules) {
        const score = rule.evaluate(candidate);
        candidate.confidenceBreakdown.rulesApplied[rule.id] = score;
        
        // Example naive aggregation: we could do a weighted sum or max. 
        // For now, let's take an additive approach clamped to 1.0, or average.
        // The user specified "multiplies or stacks". Let's stack them and clamp.
        overall += score;
      }
      
      candidate.confidenceBreakdown.overallScore = Math.min(overall, 1.0);
      candidate.overallConfidence = candidate.confidenceBreakdown.overallScore;
      scored++;
    }

    const duration = performance.now() - startTime;
    context.session.executionMetrics[this.id] = {
      durationMs: duration,
      candidatesScored: scored,
      rulesApplied: rules.length
    };
  }
}
