import { BaseStrategy } from "./base";
import { GenerationTarget, GenerationSettings } from "../types";

export class MedicalStrategy extends BaseStrategy {
  id = "strategy:medical";
  name = "Medical Strategy";
  domain = "medical";

  getTargets(): GenerationTarget {
    return {
      uniquenessTarget: 0.7,
      pronounceabilityTarget: 0.9,
      lengthTarget: { min: 6, max: 12, ideal: 8 },
      syllableTarget: { min: 3, max: 5, ideal: 3 }
    };
  }

  getSettings(): GenerationSettings {
    return {
      mutationAllowance: 0.2, // Very low mutation, medical names must be safe
      innovationLevel: 0.3,
      scoringWeights: { safety: 0.9, structural: 0.1 },
      qualityThresholds: { minScore: 0.8 },
      stoppingCriteria: { maxIterations: 500, targetCount: 20, timeoutMs: 5000 }
    };
  }
}
