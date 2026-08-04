import { ValidationRule, ValidationFinding } from "../types";
import { CategoryBlueprint } from "../../blueprint/types";

export class GenerationReadinessValidator implements ValidationRule {
  id = "validator:readiness";
  name = "Generation Readiness Validator";
  category = "readiness" as const;

  validate(blueprint: CategoryBlueprint): ValidationFinding[] {
    const findings: ValidationFinding[] = [];

    // Check if we have enough info to actually generate something useful
    const hasStructure = blueprint.preferredStructures.length > 0;
    const hasTransitions = blueprint.preferredTransitions.length > 0;

    if (!hasStructure || !hasTransitions) {
      findings.push({
        id: crypto.randomUUID(),
        ruleId: this.id,
        category: this.category,
        severity: "warning",
        message: "Blueprint may not be ready for generation without both structures and transitions.",
        affectedRules: []
      });
    }

    return findings;
  }
}
