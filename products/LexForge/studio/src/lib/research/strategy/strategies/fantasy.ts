import { BaseStrategy } from "./base";
import { GenerationTarget, GenerationSettings } from "../types";

export class FantasyStrategy extends BaseStrategy {
  id = "strategy:fantasy";
  name = "Fantasy Strategy";
  domain = "fantasy";

  getTargets(): GenerationTarget {
    return {
      uniquenessTarget: 0.95,
      pronounceabilityTarget: 0.6,
      lengthTarget: { min: 5, max: 12, ideal: 8 },
      syllableTarget: { min: 2, max: 4, ideal: 3 }
    };
  }

  getSettings(): GenerationSettings {
    return {
      mutationAllowance: 0.6,
      innovationLevel: 0.9,
      scoringWeights: { phoneticFlow: 0.8 },
      qualityThresholds: { minScore: 0.6 },
      stoppingCriteria: { maxIterations: 2000, targetCount: 100, timeoutMs: 10000 }
    };
  }
}
