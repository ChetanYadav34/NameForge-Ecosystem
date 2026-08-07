import { IntentIR, SemanticIR } from "../models/ir";
import { IPlanner, PlannerContext } from "./assembler";

export class SemanticPlanner implements IPlanner<IntentIR, SemanticIR> {
  public readonly id = "planner:semantic:baseline";

  public compile(input: IntentIR, context: PlannerContext): SemanticIR[] {
    // For Phase 23, we simply forward the semantic seeds as expanded nodes.
    // In future, this would traverse the GraphProvider.
    return [{
      id: crypto.randomUUID(),
      sourceIntentId: input.id,
      expandedNodes: input.semanticSeeds.map(seed => ({
        id: `node:${seed}`,
        concept: seed,
        metadata: {}
      }))
    }];
  }
}
