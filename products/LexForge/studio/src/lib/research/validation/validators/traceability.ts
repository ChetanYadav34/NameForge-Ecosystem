import { ValidationRule, ValidationFinding } from "../types";
import { CategoryBlueprint } from "../../blueprint/types";

export class TraceabilityValidator implements ValidationRule {
  id = "validator:traceability";
  name = "Traceability Validator";
  category = "evidence" as const;

  validate(blueprint: CategoryBlueprint): ValidationFinding[] {
    const findings: ValidationFinding[] = [];

    // Validates that the trace isn't broken inside the signature patterns themselves
    // Very simplified for now
    for (const rule of blueprint.preferredStructures) {
      if (rule.signaturePatterns?.some(sp => !sp.originalPattern)) {
        findings.push({
          id: crypto.randomUUID(),
          ruleId: this.id,
          category: this.category,
          severity: "error",
          message: `Rule ${rule.id} has a broken signature pattern reference.`,
          affectedRules: [rule]
        });
      }
    }

    return findings;
  }
}
