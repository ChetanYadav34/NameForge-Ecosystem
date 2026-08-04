import { 
  GenerationPlan, 
  GenerationObjective, 
  GenerationProfile,
  GenerationInstruction,
  GenerationConstraint,
  GenerationSequence,
  GenerationTarget,
  GenerationSettings
} from "../types";

export class PlanBuilder {
  build(
    blueprintVersion: string,
    objective: GenerationObjective,
    profile: GenerationProfile,
    structures: GenerationInstruction[],
    flows: GenerationInstruction[],
    morphology: GenerationInstruction[],
    transitions: GenerationInstruction[],
    reqClusters: GenerationInstruction[],
    forbClusters: GenerationConstraint[],
    sequence: GenerationSequence,
    targets: GenerationTarget,
    settings: GenerationSettings
  ): GenerationPlan {
    return Object.freeze({
      id: crypto.randomUUID(),
      sourceBlueprintVersion: blueprintVersion,
      objective,
      profile,
      allowedStructures: structures,
      phoneticPreferences: flows,
      preferredMorphology: morphology,
      preferredTransitions: transitions,
      requiredClusters: reqClusters,
      forbiddenClusters: forbClusters,
      constructionSequence: sequence,
      targets,
      settings,
      generatedAt: new Date().toISOString(),
      metadata: {}
    });
  }
}
