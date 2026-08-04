import { FilteredCandidateBatch, FilteredCandidate } from "../filtering/types";
export type { FilteredCandidateBatch, FilteredCandidate };
import { GenerationPlan } from "../strategy/types";
import { ValidatedBlueprint } from "../validation/types";

export interface RankingScore {
  strategyId: string;
  baseScore: number;
  bonus: number;
  penalty: number;
  finalScore: number;
  factors: Record<string, number>;
}

export interface RankedCandidate {
  filteredCandidate: FilteredCandidate;
  ranking: RankingScore;
  rankIndex: number;
}

export interface RankingSummary {
  highestScore: number;
  lowestScore: number;
  averageScore: number;
  strategyUsed: string;
  scoreDistribution: Record<string, number>; // e.g. "0.9-1.0": 15
  rankingStatistics: Record<string, any>;
}

export interface RankedCandidateBatch {
  id: string;
  sourceBatchId: string;
  candidates: RankedCandidate[];
  summary: RankingSummary;
  rankedAt: string;
}

export interface RankingContext {
  plan: GenerationPlan;
  blueprint: ValidatedBlueprint;
}

export interface RankingStrategy {
  id: string;
  name: string;
  score(candidate: FilteredCandidate, context: RankingContext): RankingScore;
}
