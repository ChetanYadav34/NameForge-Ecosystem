import { PatternAssessment, AggregatedScores } from "../types";

export class ScoreAggregator {
  aggregate(assessments: PatternAssessment[]): AggregatedScores {
    const scores: AggregatedScores = {
      importance: 0,
      stability: 0,
      diversity: 0,
      evidenceQuality: 0,
      confidence: 0
    };

    if (assessments.length === 0) return scores;

    for (const assessment of assessments) {
      scores.importance += assessment.importanceContribution;
      scores.stability += assessment.stabilityContribution;
      scores.diversity += assessment.diversityContribution;
      scores.evidenceQuality += assessment.evidenceStrength;
      scores.confidence += assessment.confidenceContribution;
    }

    // Average the scores to prevent unbounded growth based on number of analyzers
    const count = assessments.length;
    scores.importance /= count;
    scores.stability /= count;
    scores.diversity /= count;
    scores.evidenceQuality /= count;
    scores.confidence /= count;

    return scores;
  }
}
