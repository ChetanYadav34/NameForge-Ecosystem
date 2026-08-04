import { GenerationRule } from "../../blueprint/types";
import { GenerationConstraint } from "../types";

export class ConstraintBuilder {
  build(rules: GenerationRule[]): GenerationConstraint[] {
    return rules.map(rule => ({
      id: crypto.randomUUID(),
      type: "conflict_override", // Simplify for now
      value: rule.description,
      rules: [rule]
    }));
  }
}
