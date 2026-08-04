import { ValidationRule, ValidationFinding } from "../types";
import { CategoryBlueprint } from "../../blueprint/types";

export class StructuralValidator implements ValidationRule {
  id = "validator:structure";
  name = "Structural Validator";
  category = "structure" as const;

  validate(blueprint: CategoryBlueprint): ValidationFinding[] {
    const findings: ValidationFinding[] = [];

    if (!blueprint.identityProfile) {
      findings.push({
        id: crypto.randomUUID(),
        ruleId: this.id,
        category: this.category,
        severity: "error",
        message: "Blueprint is missing an identity profile.",
        affectedRules: []
      });
    }

    if (!Array.isArray(blueprint.dominantPatternClusters)) {
      findings.push({
        id: crypto.randomUUID(),
        ruleId: this.id,
        category: this.category,
        severity: "critical",
        message: "dominantPatternClusters is not an array.",
        affectedRules: []
      });
    }

    return findings;
  }
}
