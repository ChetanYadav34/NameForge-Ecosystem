import { RankedCandidate } from './RankingEngine';

export class QualityGateService {
  public filter(candidates: RankedCandidate[], minScore: number = 70): RankedCandidate[] {
    // Reject anything that doesn't meet minimum brandability/semantic score thresholds
    return candidates.filter(c => (c.score?.totalScore || 0) >= minScore);
  }
}
