import { ResearchContext, ResearchPass, EvidenceRecord } from "../types";

export class EvidenceMergePass implements ResearchPass {
  id = "pass:evidence-merge";
  name = "Evidence Merge Pass";
  priority = 300;

  async execute(context: ResearchContext): Promise<void> {
    const startTime = performance.now();
    
    // Group evidence by the target word
    const groupedEvidence = new Map<string, EvidenceRecord[]>();
    
    for (const ev of context.discoveredEvidence) {
      const target = ev.metadata.target as string;
      if (!target) continue;
      
      const lowerTarget = target.toLowerCase();
      if (!groupedEvidence.has(lowerTarget)) {
        groupedEvidence.set(lowerTarget, []);
      }
      
      // We don't overwrite. We just append the evidence.
      // But we can filter out identical duplicates if a provider returned the exact same relation twice.
      const existing = groupedEvidence.get(lowerTarget)!;
      const isDuplicate = existing.some(e => e.provider === ev.provider && e.relation === ev.relation && e.source === ev.source);
      
      if (!isDuplicate) {
        existing.push(ev);
      }
    }

    // Attach to context for the builder pass
    (context as any).groupedEvidence = groupedEvidence;

    const duration = performance.now() - startTime;
    context.session.executionMetrics[this.id] = {
      durationMs: duration,
      uniqueTargets: groupedEvidence.size,
      totalEvidenceMerged: context.discoveredEvidence.length
    };
  }
}
