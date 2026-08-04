import { FilteredCandidate, RankingContext, RankingScore, RankingStrategy } from "./types";

export class BalancedRankingStrategy implements RankingStrategy {
  id = "strategy:balanced";
  name = "Balanced Ranking Strategy";

  score(candidate: FilteredCandidate, context: RankingContext): RankingScore {
    const baseScore = candidate.evaluatedCandidate.evaluation.compositeScore;
    const finalScore = Math.min(1.0, Math.max(0.0, baseScore));
    return {
      strategyId: this.id,
      baseScore,
      bonus: 0,
      penalty: 0,
      finalScore,
      factors: { "base": baseScore }
    };
  }
}

export class InnovationRankingStrategy implements RankingStrategy {
  id = "strategy:innovation";
  name = "Innovation Ranking Strategy";

  score(candidate: FilteredCandidate, context: RankingContext): RankingScore {
    const baseScore = candidate.evaluatedCandidate.evaluation.compositeScore;
    const finalScore = Math.min(1.0, Math.max(0.0, baseScore));
    return {
      strategyId: this.id,
      baseScore,
      bonus: 0,
      penalty: 0,
      finalScore,
      factors: { "base": baseScore }
    };
  }
}

export class CommercialRankingStrategy implements RankingStrategy {
  id = "strategy:commercial";
  name = "Commercial Ranking Strategy";

  score(candidate: FilteredCandidate, context: RankingContext): RankingScore {
    const baseScore = candidate.evaluatedCandidate.evaluation.compositeScore;
    const finalScore = Math.min(1.0, Math.max(0.0, baseScore));
    return {
      strategyId: this.id,
      baseScore,
      bonus: 0,
      penalty: 0,
      finalScore,
      factors: { "base": baseScore }
    };
  }
}

export class MedicalRankingStrategy implements RankingStrategy {
  id = "strategy:medical";
  name = "Medical Ranking Strategy";

  score(candidate: FilteredCandidate, context: RankingContext): RankingScore {
    const baseScore = candidate.evaluatedCandidate.evaluation.compositeScore;
    const finalScore = Math.min(1.0, Math.max(0.0, baseScore));
    return {
      strategyId: this.id,
      baseScore,
      bonus: 0,
      penalty: 0,
      finalScore,
      factors: { "base": baseScore }
    };
  }
}

export class FantasyRankingStrategy implements RankingStrategy {
  id = "strategy:fantasy";
  name = "Fantasy Ranking Strategy";

  score(candidate: FilteredCandidate, context: RankingContext): RankingScore {
    const baseScore = candidate.evaluatedCandidate.evaluation.compositeScore;
    const finalScore = Math.min(1.0, Math.max(0.0, baseScore));
    return {
      strategyId: this.id,
      baseScore,
      bonus: 0,
      penalty: 0,
      finalScore,
      factors: { "base": baseScore }
    };
  }
}

export class SpeedRankingStrategy implements RankingStrategy {
  id = "strategy:speed";
  name = "Speed Ranking Strategy";

  score(candidate: FilteredCandidate, context: RankingContext): RankingScore {
    const baseScore = candidate.evaluatedCandidate.evaluation.compositeScore;
    const finalScore = Math.min(1.0, Math.max(0.0, baseScore));
    return {
      strategyId: this.id,
      baseScore,
      bonus: 0,
      penalty: 0,
      finalScore,
      factors: { "base": baseScore }
    };
  }
}
