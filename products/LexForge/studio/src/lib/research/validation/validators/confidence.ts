import { ValidationRule, ValidationFinding } from "../types";
import { CategoryBlueprint } from "../../blueprint/types";

export class ConfidenceValidator implements ValidationRule {
  id = "validator:confidence";
  name = "Confidence Validator";
  category = "confidence" as const;

  validate(blueprint: CategoryBlueprint): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    
    if (blueprint.confidence < 0.3) {
      findings.push({
        id: crypto.randomUUID(),
        ruleId: this.id,
        category: this.category,
        severity: "warning",
        message: "Blueprint confidence is extremely low (< 0.3).",
        affectedRules: []
      });
    }

    return findings;
  }
}
