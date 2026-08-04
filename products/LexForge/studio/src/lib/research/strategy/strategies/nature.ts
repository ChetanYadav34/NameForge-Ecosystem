import { BaseStrategy } from "./base";
import { GenerationTarget, GenerationSettings } from "../types";

export class NatureStrategy extends BaseStrategy {
  id = "strategy:nature";
  name = "Nature Strategy";
  domain = "nature";

  getTargets(): GenerationTarget {
    return {
      uniquenessTarget: 0.8,
      pronounceabilityTarget: 0.9,
      lengthTarget: { min: 4, max: 9, ideal: 6 },
      syllableTarget: { min: 1, max: 3, ideal: 2 }
    };
  }

  getSettings(): GenerationSettings {
    return {
      mutationAllowance: 0.3,
      innovationLevel: 0.5,
      scoringWeights: { phoneticFlow: 0.7, uniqueness: 0.3 },
      qualityThresholds: { minScore: 0.75 },
      stoppingCriteria: { maxIterations: 800, targetCount: 50, timeoutMs: 5000 }
    };
  }
}
