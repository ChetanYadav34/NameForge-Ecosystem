import { ValidationRule, ValidationFinding } from "../types";
import { CategoryBlueprint } from "../../blueprint/types";

export class BlueprintCompletenessValidator implements ValidationRule {
  id = "validator:completeness";
  name = "Blueprint Completeness Validator";
  category = "completeness" as const;

  validate(blueprint: CategoryBlueprint): ValidationFinding[] {
    const findings: ValidationFinding[] = [];

    if (blueprint.dominantPatternClusters.length === 0) {
      findings.push({
        id: crypto.randomUUID(),
        ruleId: this.id,
        category: this.category,
        severity: "error",
        message: "Blueprint has no dominant pattern clusters.",
        affectedRules: []
      });
    }

    if (blueprint.preferredStructures.length === 0 && blueprint.preferredPhoneticFlows.length === 0) {
      findings.push({
        id: crypto.randomUUID(),
        ruleId: this.id,
        category: this.category,
        severity: "warning",
        message: "Blueprint lacks both preferred structures and phonetic flows.",
        affectedRules: []
      });
    }

    return findings;
  }
}
