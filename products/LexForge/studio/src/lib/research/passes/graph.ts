import { ResearchContext, ResearchPass } from "../types";
import { VocabularyGraphImpl } from "../models/graph";

export class VocabularyGraphConstructionPass implements ResearchPass {
  id = "pass:graph-construction";
  name = "Vocabulary Graph Construction Pass";
  priority = 800;

  async execute(context: ResearchContext): Promise<void> {
    const startTime = performance.now();
    const graph = new VocabularyGraphImpl(context.seed);
    
    // Add accepted vocabulary
    for (const candidate of context.acceptedVocabulary) {
      if (candidate.lexEntry) {
        graph.addNode({
          term: candidate.term,
          lexEntry: candidate.lexEntry,
          confidence: candidate.overallConfidence,
          ranking: candidate.rankingScore,
          evidence: candidate.evidence,
          providerSummary: candidate.providerSummary,
          metadata: candidate.metadata
        });
      }
    }

    // Add some naive edges based on evidence
    for (const candidate of context.acceptedVocabulary) {
      for (const ev of candidate.evidence) {
        if (ev.discoveredFrom) {
          // Check if the source of discovery is also in the graph
          const sourceNode = graph.getNode(ev.discoveredFrom);
          if (sourceNode) {
            graph.addEdge({
              source: ev.discoveredFrom,
              target: candidate.term,
              relationship: ev.relation,
              weight: ev.strength
            });
          }
        }
      }
    }

    context.graph = graph;

    const duration = performance.now() - startTime;
    context.session.executionMetrics[this.id] = {
      durationMs: duration,
      nodesCreated: graph.nodes.size,
      edgesCreated: graph.edges.length
    };
  }
}
