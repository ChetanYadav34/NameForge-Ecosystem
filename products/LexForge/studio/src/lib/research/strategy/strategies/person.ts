import { BaseStrategy } from "./base";
import { GenerationTarget, GenerationSettings } from "../types";

export class PersonNameStrategy extends BaseStrategy {
  id = "strategy:person";
  name = "Person Name Strategy";
  domain = "person";

  getTargets(): GenerationTarget {
    return {
      uniquenessTarget: 0.6,
      pronounceabilityTarget: 1.0,
      lengthTarget: { min: 3, max: 9, ideal: 5 },
      syllableTarget: { min: 1, max: 3, ideal: 2 }
    };
  }

  getSettings(): GenerationSettings {
    return {
      mutationAllowance: 0.1, // Names shouldn't look like typos
      innovationLevel: 0.2,
      scoringWeights: { phoneticFlow: 1.0 },
      qualityThresholds: { minScore: 0.9 },
      stoppingCriteria: { maxIterations: 500, targetCount: 30, timeoutMs: 5000 }
    };
  }
}
