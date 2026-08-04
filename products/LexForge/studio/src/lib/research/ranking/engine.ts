import { FilteredCandidateBatch } from "../filtering/types";
import { ValidatedBlueprint } from "../validation/types";
import { GenerationPlan } from "../strategy/types";
import {
  RankedCandidateBatch,
  RankedCandidate,
  RankingSummary,
  RankingContext,
  RankingScore,
  RankingStrategy
} from "./types";
import { rankingStrategyRegistry } from "./registry";
import { BalancedRankingStrategy } from "./strategies";

export class CandidateRankingEngine {
  rank(
    batch: FilteredCandidateBatch,
    plan: GenerationPlan,
    blueprint: ValidatedBlueprint,
    strategyId?: string
  ): RankedCandidateBatch {
    const context: RankingContext = { plan, blueprint };
    
    // Choose strategy or fallback to balanced
    const idToUse = strategyId || "strategy:balanced";
    let strategy = rankingStrategyRegistry.get(idToUse);
    if (!strategy) {
      strategy = new BalancedRankingStrategy();
    }

    // Process only accepted candidates
    const acceptedCandidates = batch.candidates.filter(c => c.decision.accepted);
    
    // Calculate scores
    const scoredCandidates = acceptedCandidates.map(c => {
      const rankingScore = strategy!.score(c, context);
      return {
        filteredCandidate: c,
        ranking: rankingScore
      };
    });

    // Sort by finalScore descending
    scoredCandidates.sort((a, b) => b.ranking.finalScore - a.ranking.finalScore);

    // Assign rankIndex
    const rankedCandidates: RankedCandidate[] = scoredCandidates.map((c, idx) => ({
      ...c,
      rankIndex: idx
    }));

    // Summary calculation
    let highestScore = 0;
    let lowestScore = 0;
    let sumScore = 0;
    const scoreDistribution: Record<string, number> = {};

    if (rankedCandidates.length > 0) {
      highestScore = rankedCandidates[0].ranking.finalScore;
      lowestScore = rankedCandidates[rankedCandidates.length - 1].ranking.finalScore;
      
      rankedCandidates.forEach(c => {
        sumScore += c.ranking.finalScore;
        const bucket = (Math.floor(c.ranking.finalScore * 10) / 10).toFixed(1);
        const bucketKey = `${bucket}-${(parseFloat(bucket) + 0.1).toFixed(1)}`;
        if (!scoreDistribution[bucketKey]) scoreDistribution[bucketKey] = 0;
        scoreDistribution[bucketKey]++;
      });
    }

    const summary: RankingSummary = {
      highestScore,
      lowestScore,
      averageScore: rankedCandidates.length > 0 ? sumScore / rankedCandidates.length : 0,
      strategyUsed: strategy.id,
      scoreDistribution,
      rankingStatistics: {}
    };

    return Object.freeze({
      id: crypto.randomUUID(),
      sourceBatchId: batch.id,
      candidates: rankedCandidates,
      summary,
      rankedAt: new Date().toISOString()
    });
  }
}

export const rankingEngine = new CandidateRankingEngine();
