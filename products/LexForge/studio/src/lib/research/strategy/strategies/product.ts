import { BaseStrategy } from "./base";
import { GenerationTarget, GenerationSettings } from "../types";

export class ProductStrategy extends BaseStrategy {
  id = "strategy:product";
  name = "Product Strategy";
  domain = "product";

  getTargets(): GenerationTarget {
    return {
      uniquenessTarget: 0.85,
      pronounceabilityTarget: 0.8,
      lengthTarget: { min: 4, max: 10, ideal: 6 },
      syllableTarget: { min: 2, max: 4, ideal: 2 }
    };
  }

  getSettings(): GenerationSettings {
    return {
      mutationAllowance: 0.5,
      innovationLevel: 0.7,
      scoringWeights: { phoneticFlow: 0.5, uniqueness: 0.5 },
      qualityThresholds: { minScore: 0.7 },
      stoppingCriteria: { maxIterations: 1000, targetCount: 50, timeoutMs: 5000 }
    };
  }
}
