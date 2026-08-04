import { BaseStrategy } from "./base";
import { GenerationTarget, GenerationSettings } from "../types";

export class CompanyStrategy extends BaseStrategy {
  id = "strategy:company";
  name = "Company Strategy";
  domain = "company";

  getTargets(): GenerationTarget {
    return {
      uniquenessTarget: 0.9,
      pronounceabilityTarget: 0.85,
      lengthTarget: { min: 5, max: 12, ideal: 8 },
      syllableTarget: { min: 2, max: 4, ideal: 3 }
    };
  }

  getSettings(): GenerationSettings {
    return {
      mutationAllowance: 0.4,
      innovationLevel: 0.6,
      scoringWeights: { structural: 0.6, uniqueness: 0.4 },
      qualityThresholds: { minScore: 0.8 },
      stoppingCriteria: { maxIterations: 1200, targetCount: 50, timeoutMs: 5000 }
    };
  }
}
