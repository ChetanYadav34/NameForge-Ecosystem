import { BlueprintFragment, PatternCluster } from "../types";

export class ClusterBuilder {
  buildClusters(fragments: BlueprintFragment[]): PatternCluster[] {
    const clusters: PatternCluster[] = [];
    
    for (const frag of fragments) {
      if (frag.type === "cluster") {
        clusters.push({
          id: crypto.randomUUID(),
          name: frag.data.name || "Unnamed Cluster",
          description: frag.data.description || "Generated cluster from analysis",
          patterns: frag.trace,
          signaturePatterns: frag.trace
        });
      }
    }
    
    return clusters;
  }
}
