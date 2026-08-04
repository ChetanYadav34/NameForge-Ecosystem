import { ResearchContext, ResearchPass, CategoryKnowledge } from "../types";

export class CategoryKnowledgeAssemblyPass implements ResearchPass {
  id = "pass:knowledge-assembly";
  name = "Category Knowledge Assembly Pass";
  priority = 1000;

  async execute(context: ResearchContext): Promise<void> {
    const startTime = performance.now();
    
    context.session.finishedAt = new Date().toISOString();
    const totalDuration = startTime - new Date(context.session.startedAt).getTime(); // approx
    
    // Collect providers
    const uniqueProviders = new Set<string>();
    for (const ev of context.discoveredEvidence) {
      uniqueProviders.add(ev.provider);
    }

    const knowledge: CategoryKnowledge = {
      seed: context.seed,
      researchSession: context.session,
      candidatePool: Array.from(context.candidatePool.values()),
      acceptedVocabulary: context.acceptedVocabulary,
      rejectedVocabulary: context.rejectedVocabulary,
      vocabularyGraph: context.graph!,
      featureProfiles: context.profiles,
      providerSummary: Array.from(uniqueProviders),
      statistics: context.session.statistics,
      metadata: {},
      executionTime: totalDuration,
      version: "2.0.0"
    };

    context.categoryKnowledge = knowledge;

    const duration = performance.now() - startTime;
    context.session.executionMetrics[this.id] = {
      durationMs: duration
    };
  }
}
