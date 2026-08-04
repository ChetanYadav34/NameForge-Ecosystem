import { AggregatedScores } from "../types";

export class ScoreNormalizer {
  /**
   * Normalizes aggregated scores into a 0.0 - 1.0 range.
   * Uses a clamping function to ensure bounds are respected.
   */
  normalize(scores: AggregatedScores): AggregatedScores {
    return {
      importance: this.clamp(scores.importance),
      stability: this.clamp(scores.stability),
      diversity: this.clamp(scores.diversity),
      evidenceQuality: this.clamp(scores.evidenceQuality),
      confidence: this.clamp(scores.confidence)
    };
  }

  private clamp(val: number): number {
    return Math.max(0.0, Math.min(1.0, val));
  }
}
