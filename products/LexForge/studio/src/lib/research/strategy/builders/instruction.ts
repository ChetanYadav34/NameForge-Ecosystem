import { GenerationRule } from "../../blueprint/types";
import { GenerationInstruction } from "../types";

export class InstructionBuilder {
  build(rules: GenerationRule[], type: string): GenerationInstruction[] {
    return rules.map(rule => ({
      id: crypto.randomUUID(),
      type,
      directive: `Follow rule: ${rule.description}`,
      rules: [rule]
    }));
  }
}
