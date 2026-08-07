import { SemanticIR, MorphologicalIR } from "../models/ir";
import { IPlanner, PlannerContext } from "./assembler";

export class MorphologyPlanner implements IPlanner<SemanticIR, MorphologicalIR> {
  public readonly id = "planner:morphology:baseline";

  public compile(input: SemanticIR, context: PlannerContext): MorphologicalIR[] {
    // Currently returns a basic morphological shell.
    return [{
      id: crypto.randomUUID(),
      sourceSemanticId: input.id,
      roots: [], // Would normally be looked up via context.corpus
      affixes: []
    }];
  }
}
