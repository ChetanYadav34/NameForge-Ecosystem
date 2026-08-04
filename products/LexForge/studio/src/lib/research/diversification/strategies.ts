import { DiversificationContext, DiversificationStrategy, RankedCandidateBatch, SimilarityAnalyzer, SimilarityCluster, RankedCandidate } from "./types";

function simpleCluster(batch: RankedCandidateBatch, analyzers: SimilarityAnalyzer[], context: DiversificationContext, threshold: number = 0.8): SimilarityCluster[] {
  const clusters: SimilarityCluster[] = [];
  const processed = new Set<string>();

  for (const candidate of batch.candidates) {
    const id = candidate.filteredCandidate.evaluatedCandidate.candidate.id;
    if (processed.has(id)) continue;

    const clusterMembers: RankedCandidate[] = [];
    processed.add(id);

    // Find similar candidates
    for (const other of batch.candidates) {
      const otherId = other.filteredCandidate.evaluatedCandidate.candidate.id;
      if (processed.has(otherId)) continue;

      // Compute average similarity across all analyzers
      let totalSim = 0;
      for (const analyzer of analyzers) {
        totalSim += analyzer.calculateSimilarity(candidate, other, context);
      }
      const avgSim = analyzers.length > 0 ? totalSim / analyzers.length : 0;

      if (avgSim >= threshold) {
        clusterMembers.push(other);
        processed.add(otherId);
      }
    }

    // Add representative and members
    clusters.push({
      id: crypto.randomUUID(),
      representative: candidate,
      members: clusterMembers,
      similarityScore: clusterMembers.length > 0 ? threshold : 1.0, // Mock metric
      diversityScore: 1.0 // Mock metric
    });
  }

  return clusters;
}

export class BalancedDiversificationStrategy implements DiversificationStrategy {
  id = "strategy:diversification:balanced";
  name = "Balanced Diversification Strategy";

  cluster(batch: RankedCandidateBatch, analyzers: SimilarityAnalyzer[], context: DiversificationContext): SimilarityCluster[] {
    return simpleCluster(batch, analyzers, context, 0.7);
  }
}

export class CommercialDiversificationStrategy implements DiversificationStrategy {
  id = "strategy:diversification:commercial";
  name = "Commercial Diversification Strategy";

  cluster(batch: RankedCandidateBatch, analyzers: SimilarityAnalyzer[], context: DiversificationContext): SimilarityCluster[] {
    return simpleCluster(batch, analyzers, context, 0.8);
  }
}

export class BrandDiversificationStrategy implements DiversificationStrategy {
  id = "strategy:diversification:brand";
  name = "Brand Diversification Strategy";

  cluster(batch: RankedCandidateBatch, analyzers: SimilarityAnalyzer[], context: DiversificationContext): SimilarityCluster[] {
    return simpleCluster(batch, analyzers, context, 0.75);
  }
}

export class MedicalDiversificationStrategy implements DiversificationStrategy {
  id = "strategy:diversification:medical";
  name = "Medical Diversification Strategy";

  cluster(batch: RankedCandidateBatch, analyzers: SimilarityAnalyzer[], context: DiversificationContext): SimilarityCluster[] {
    return simpleCluster(batch, analyzers, context, 0.85);
  }
}

export class FantasyDiversificationStrategy implements DiversificationStrategy {
  id = "strategy:diversification:fantasy";
  name = "Fantasy Diversification Strategy";

  cluster(batch: RankedCandidateBatch, analyzers: SimilarityAnalyzer[], context: DiversificationContext): SimilarityCluster[] {
    return simpleCluster(batch, analyzers, context, 0.6); // Looser threshold for fantasy
  }
}

export class InnovationDiversificationStrategy implements DiversificationStrategy {
  id = "strategy:diversification:innovation";
  name = "Innovation Diversification Strategy";

  cluster(batch: RankedCandidateBatch, analyzers: SimilarityAnalyzer[], context: DiversificationContext): SimilarityCluster[] {
    return simpleCluster(batch, analyzers, context, 0.65);
  }
}
