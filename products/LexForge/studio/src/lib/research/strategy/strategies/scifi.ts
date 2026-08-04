import { BaseStrategy } from "./base";
import { GenerationTarget, GenerationSettings } from "../types";

export class SciFiStrategy extends BaseStrategy {
  id = "strategy:scifi";
  name = "Sci-Fi Strategy";
  domain = "scifi";

  getTargets(): GenerationTarget {
    return {
      uniquenessTarget: 0.8,
      pronounceabilityTarget: 0.7,
      lengthTarget: { min: 4, max: 10, ideal: 7 },
      syllableTarget: { min: 1, max: 4, ideal: 2 }
    };
  }

  getSettings(): GenerationSettings {
    return {
      mutationAllowance: 0.5,
      innovationLevel: 0.7,
      scoringWeights: { structural: 0.8 },
      qualityThresholds: { minScore: 0.7 },
      stoppingCriteria: { maxIterations: 1000, targetCount: 50, timeoutMs: 5000 }
    };
  }
}
