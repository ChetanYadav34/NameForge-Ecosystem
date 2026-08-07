import { IEvaluator, OnsetLegalityEvaluator, TransitionQualityEvaluator, SyllableBalanceEvaluator, OrthographicQualityEvaluator } from "./pronounceability";
import { IScoringProvider } from "../../scoring";
import { LinguisticCandidate, Score } from "../../../models/types";

export class AggregatedPronounceabilityScorer implements IScoringProvider {
  public readonly id = "scorer:en:pronounceability";
  public readonly name = "Pronounceability Engine";

  private evaluators: IEvaluator[] = [
    new OnsetLegalityEvaluator(),
    new TransitionQualityEvaluator(),
    new SyllableBalanceEvaluator(),
    new OrthographicQualityEvaluator()
  ];
  
  public async score(candidate: LinguisticCandidate): Promise<Score> {
    let totalScore = 0;
    
    for (const evaluator of this.evaluators) {
      totalScore += evaluator.evaluate({ candidate });
    }

    const average = totalScore / this.evaluators.length;

    return {
      metricId: this.id,
      value: average,
      confidence: 0.9,
      provenanceId: candidate.provenance.jobId
    };
  }
}
