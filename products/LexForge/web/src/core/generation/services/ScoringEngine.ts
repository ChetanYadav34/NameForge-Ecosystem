import { CandidateWord } from '../strategies/IGenerationStrategy';

export interface ScoredCandidate extends CandidateWord {
  // Score is now part of CandidateWord, but we update it here.
}

export class ScoringEngine {
  public score(candidates: CandidateWord[]): ScoredCandidate[] {
    return candidates.map(c => {
      const semanticScore = Math.floor(Math.random() * 30) + 70;
      const phoneticScore = Math.floor(Math.random() * 30) + 70;
      const industryScore = Math.floor(Math.random() * 30) + 70;
      const totalScore = (semanticScore + phoneticScore + industryScore) / 3;

      return {
        ...c,
        score: {
          semanticScore,
          phoneticScore,
          industryScore,
          totalScore
        }
      };
    });
  }
}
