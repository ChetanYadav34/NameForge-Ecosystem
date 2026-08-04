import { ValidatedBlueprint } from "../../validation/types";
import { GenerationStrategy, GenerationObjective, GenerationPlan, GenerationTarget, GenerationSettings } from "../types";
import { InstructionBuilder, ConstraintBuilder, SequenceBuilder, PlanBuilder } from "../builders";

export abstract class BaseStrategy implements GenerationStrategy {
  abstract id: string;
  abstract name: string;
  abstract domain: string;

  protected instructionBuilder = new InstructionBuilder();
  protected constraintBuilder = new ConstraintBuilder();
  protected sequenceBuilder = new SequenceBuilder();
  protected planBuilder = new PlanBuilder();

  abstract getTargets(): GenerationTarget;
  abstract getSettings(): GenerationSettings;

  plan(validated: ValidatedBlueprint, objective: GenerationObjective): GenerationPlan {
    const blueprint = validated.blueprint;

    const structures = this.instructionBuilder.build(blueprint.preferredStructures, "structure");
    const flows = this.instructionBuilder.build(blueprint.preferredPhoneticFlows, "flow");
    const morphology = this.instructionBuilder.build(blueprint.preferredMorphology, "morphology");
    const transitions = this.instructionBuilder.build(blueprint.preferredTransitions, "transition");
    
    // Convert incompatible combinations into constraints
    const forbiddenClusters = this.constraintBuilder.build(
      blueprint.generationConstraints
    );

    const sequence = this.sequenceBuilder.build(structures, flows, forbiddenClusters);

    const profile = {
      identity: blueprint.identityProfile,
      style: objective.styleTarget,
      domain: this.domain
    };

    return this.planBuilder.build(
      "1.0", // blueprint version placeholder
      objective,
      profile,
      structures,
      flows,
      morphology,
      transitions,
      [], // required clusters
      forbiddenClusters,
      sequence,
      this.getTargets(),
      this.getSettings()
    );
  }
}
