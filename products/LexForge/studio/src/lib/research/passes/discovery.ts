import { ResearchContext, ResearchPass } from "../types";
import { discoveryProviderRegistry } from "../registry";

export class EvidenceDiscoveryPass implements ResearchPass {
  id = "pass:evidence-discovery";
  name = "Evidence Discovery Pass";
  priority = 200;

  async execute(context: ResearchContext): Promise<void> {
    const startTime = performance.now();
    const providers = discoveryProviderRegistry.getAll();
    
    let totalDiscovered = 0;

    for (const provider of providers) {
      context.session.providersExecuted.push(provider.id);
      try {
        const evidence = await provider.discover(context.seed);
        context.discoveredEvidence.push(...evidence);
        totalDiscovered += evidence.length;
      } catch (error: any) {
        context.session.errors.push(`EvidenceDiscoveryPass: Provider ${provider.id} failed: ${error.message}`);
      }
    }

    const duration = performance.now() - startTime;
    
    context.session.executionMetrics[this.id] = {
      durationMs: duration,
      providersRun: providers.length,
      evidenceFound: totalDiscovered
    };
    
    context.session.statistics["raw_evidence_count"] = context.discoveredEvidence.length;
  }
}
