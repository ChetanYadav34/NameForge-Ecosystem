import { ValidatedBlueprint } from "../validation/types";
import { GenerationObjective, GenerationPlan } from "./types";
import { strategyRegistry } from "./registry";
import { ObjectiveBuilder } from "./builders";

export class GenerationStrategyEngine {
  private objectiveBuilder = new ObjectiveBuilder();

  plan(validatedBlueprint: ValidatedBlueprint, objectiveInput: Partial<GenerationObjective>): GenerationPlan {
    if (validatedBlueprint.status === "failed") {
      throw new Error("Cannot generate strategy from a failed blueprint.");
    }

    const domain = objectiveInput.domain || "brand";
    const strategy = strategyRegistry.getByDomain(domain);

    if (!strategy) {
      throw new Error(`No strategy found for domain: ${domain}`);
    }

    const objective = this.objectiveBuilder.build(
      domain,
      objectiveInput.styleTarget || "modern",
      objectiveInput.primaryFocus || "safety"
    );

    return strategy.plan(validatedBlueprint, objective);
  }
}

export const strategyEngine = new GenerationStrategyEngine();
