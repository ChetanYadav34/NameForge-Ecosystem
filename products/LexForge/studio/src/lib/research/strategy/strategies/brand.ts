import { BaseStrategy } from "./base";
import { GenerationTarget, GenerationSettings } from "../types";

export class BrandStrategy extends BaseStrategy {
  id = "strategy:brand";
  name = "Brand Strategy";
  domain = "brand";

  getTargets(): GenerationTarget {
    return {
      uniquenessTarget: 0.9,
      pronounceabilityTarget: 0.8,
      lengthTarget: { min: 4, max: 8, ideal: 6 },
      syllableTarget: { min: 2, max: 3, ideal: 2 }
    };
  }

  getSettings(): GenerationSettings {
    return {
      mutationAllowance: 0.4,
      innovationLevel: 0.8,
      scoringWeights: { pronounceability: 0.6, uniqueness: 0.4 },
      qualityThresholds: { minScore: 0.7 },
      stoppingCriteria: { maxIterations: 1000, targetCount: 50, timeoutMs: 5000 }
    };
  }
}
