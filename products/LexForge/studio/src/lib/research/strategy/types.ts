import { ValidatedBlueprint } from "../validation/types";
import { GenerationRule } from "../blueprint/types";

export interface EvidenceTrace {
  rules: GenerationRule[];
}

export interface GenerationInstruction extends EvidenceTrace {
  id: string;
  type: string;
  directive: string;
}

export interface GenerationConstraint extends EvidenceTrace {
  id: string;
  type: "forbidden_cluster" | "forbidden_structure" | "max_length" | "min_length" | "conflict_override";
  value: any;
}

export interface GenerationTarget {
  uniquenessTarget: number;
  pronounceabilityTarget: number;
  lengthTarget: { min: number; max: number; ideal: number };
  syllableTarget: { min: number; max: number; ideal: number };
}

export interface GenerationSettings {
  mutationAllowance: number;
  innovationLevel: number;
  scoringWeights: Record<string, number>;
  qualityThresholds: Record<string, number>;
  stoppingCriteria: {
    maxIterations: number;
    targetCount: number;
    timeoutMs: number;
  };
}

export interface GenerationObjective {
  domain: string;
  styleTarget: string;
  primaryFocus: "innovation" | "safety" | "speed" | "accuracy";
}

export interface GenerationStage {
  id: string;
  name: string;
  instructions: GenerationInstruction[];
}

export interface GenerationSequence {
  stages: GenerationStage[];
}

export interface GenerationProfile {
  identity: string;
  style: string;
  domain: string;
}

export interface GenerationPlan {
  id: string;
  sourceBlueprintVersion: string;
  objective: GenerationObjective;
  profile: GenerationProfile;
  allowedStructures: GenerationInstruction[];
  preferredMorphology: GenerationInstruction[];
  preferredTransitions: GenerationInstruction[];
  phoneticPreferences: GenerationInstruction[];
  requiredClusters: GenerationInstruction[];
  forbiddenClusters: GenerationConstraint[];
  constructionSequence: GenerationSequence;
  targets: GenerationTarget;
  settings: GenerationSettings;
  generatedAt: string;
  metadata: Record<string, any>;
}

export interface GenerationStrategy {
  id: string;
  name: string;
  domain: string;
  plan(blueprint: ValidatedBlueprint, objective: GenerationObjective): GenerationPlan;
}
