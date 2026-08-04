import { RankedCandidateBatch } from "../ranking/types";
import { ValidatedBlueprint } from "../validation/types";
import { GenerationPlan } from "../strategy/types";
import {
  DiversificationContext,
  DiversificationSummary,
  DiversifiedCandidate,
  DiversifiedCandidateBatch
} from "./types";
import { diversificationStrategyRegistry, similarityAnalyzerRegistry } from "./registry";
import { BalancedDiversificationStrategy } from "./strategies";

export class CandidateDiversificationEngine {
  diversify(
    batch: RankedCandidateBatch,
    plan: GenerationPlan,
    blueprint: ValidatedBlueprint,
    strategyId?: string
  ): DiversifiedCandidateBatch {
    const context: DiversificationContext = { plan, blueprint };
    
    // 1. Get Strategy
    const idToUse = strategyId || "strategy:diversification:balanced";
    let strategy = diversificationStrategyRegistry.get(idToUse);
    if (!strategy) {
      strategy = new BalancedDiversificationStrategy();
    }

    // 2. Get Analyzers
    const analyzers = similarityAnalyzerRegistry.getAll();

    // 3. Cluster
    const clusters = strategy.cluster(batch, analyzers, context);

    // 4. Transform into DiversifiedCandidates
    const diversifiedCandidates: DiversifiedCandidate[] = [];
    let sumClusterSize = 0;
    let maxClusterSize = 0;
    let sumSimilarity = 0;

    for (const cluster of clusters) {
      const clusterSize = 1 + cluster.members.length;
      sumClusterSize += clusterSize;
      if (clusterSize > maxClusterSize) {
        maxClusterSize = clusterSize;
      }
      sumSimilarity += cluster.similarityScore;

      // Add representative
      diversifiedCandidates.push({
        cluster,
        rankedCandidate: cluster.representative,
        isRepresentative: true
      });

      // Add members
      for (const member of cluster.members) {
        diversifiedCandidates.push({
          cluster,
          rankedCandidate: member,
          isRepresentative: false
        });
      }
    }

    // 5. Generate Summary
    const numClusters = clusters.length;
    const summary: DiversificationSummary = {
      clusterCount: numClusters,
      largestCluster: maxClusterSize,
      averageClusterSize: numClusters > 0 ? sumClusterSize / numClusters : 0,
      averageSimilarity: numClusters > 0 ? sumSimilarity / numClusters : 0,
      diversityScore: numClusters > 0 ? 1.0 - (sumSimilarity / numClusters) : 0, // Mock metric
      strategyUsed: strategy.id
    };

    return Object.freeze({
      id: crypto.randomUUID(),
      sourceBatchId: batch.id,
      candidates: diversifiedCandidates,
      clusters: clusters,
      summary,
      diversifiedAt: new Date().toISOString()
    });
  }
}

export const diversificationEngine = new CandidateDiversificationEngine();
