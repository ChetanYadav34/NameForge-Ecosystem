import { LinguisticCandidate, Score } from "../models/types";

/**
 * Interface for Scoring Providers.
 * Ranking consumes scoring results. Scoring modules are isolated.
 */
export interface IScoringProvider {
  readonly id: string;
  readonly name: string;
  
  /**
   * Evaluates a candidate and returns a Score object.
   * Value should be between 0 (worst) and 1 (best).
   */
  score(candidate: LinguisticCandidate): Promise<Score>;
}
