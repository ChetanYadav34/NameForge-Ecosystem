import { BlueprintFragment, GenerationRule } from "../types";

export class RuleBuilder {
  buildRules(fragments: BlueprintFragment[], ruleType: "structure" | "flow" | "morphology" | "transition"): GenerationRule[] {
    const rules: GenerationRule[] = [];
    for (const frag of fragments) {
      if (frag.type === ruleType) {
        rules.push({
          id: crypto.randomUUID(),
          type: ruleType,
          description: frag.data.description || `Extracted ${ruleType} rule`,
          signaturePatterns: frag.trace
        });
      }
    }
    return rules;
  }
}
