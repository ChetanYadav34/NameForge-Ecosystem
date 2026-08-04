import { CandidateBatch } from "./types";
import { ValidatedBlueprint } from "../validation/types";
import { GenerationPlan } from "../strategy/types";
import {
  EvaluatedCandidateBatch,
  EvaluationContext,
  EvaluatedCandidate,
  EvaluationMetric,
  EvaluationSummary
} from "./types";
import { evaluationRegistry } from "./registry";

export class EvaluationAggregator {
  aggregate(metrics: EvaluationMetric[]): number {
    if (metrics.length === 0) return 0;
    // Simple average for now. Real implementation uses strategy weights.
    const total = metrics.reduce((sum, m) => sum + m.score, 0);
    return total / metrics.length;
  }

  summarize(candidates: EvaluatedCandidate[]): EvaluationSummary {
    if (candidates.length === 0) {
      return { averageScore: 0, highestScore: 0, lowestScore: 0, metricAverages: {} };
    }

    let sum = 0;
    let min = Infinity;
    let max = -Infinity;
    const metricTotals: Record<string, number> = {};

    for (const c of candidates) {
      sum += c.evaluation.compositeScore;
      if (c.evaluation.compositeScore < min) min = c.evaluation.compositeScore;
      if (c.evaluation.compositeScore > max) max = c.evaluation.compositeScore;

      for (const m of c.evaluation.metrics) {
        if (!metricTotals[m.analyzerId]) metricTotals[m.analyzerId] = 0;
        metricTotals[m.analyzerId] += m.score;
      }
    }

    const metricAverages: Record<string, number> = {};
    for (const key in metricTotals) {
      metricAverages[key] = metricTotals[key] / candidates.length;
    }

    return {
      averageScore: sum / candidates.length,
      highestScore: max,
      lowestScore: min,
      metricAverages
    };
  }
}

export class CandidateEvaluationEngine {
  private aggregator = new EvaluationAggregator();

  evaluate(
    batch: CandidateBatch,
    plan: GenerationPlan,
    blueprint: ValidatedBlueprint
  ): EvaluatedCandidateBatch {
    const context: EvaluationContext = { plan, blueprint };
    const analyzers = evaluationRegistry.getAll();
    
    const evaluatedCandidates: EvaluatedCandidate[] = batch.candidates.map(candidate => {
      const metrics = analyzers.map(analyzer => analyzer.analyze(candidate, context));
      const compositeScore = this.aggregator.aggregate(metrics);
      
      return {
        candidate,
        evaluation: {
          metrics,
          compositeScore
        }
      };
    });

    const summary = this.aggregator.summarize(evaluatedCandidates);

    return Object.freeze({
      id: crypto.randomUUID(),
      sourceBatchId: batch.id,
      candidates: evaluatedCandidates,
      summary,
      evaluatedAt: new Date().toISOString()
    });
  }
}

export const evaluationEngine = new CandidateEvaluationEngine();
