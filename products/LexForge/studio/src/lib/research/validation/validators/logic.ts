import { ValidationRule, ValidationFinding } from "../types";
import { CategoryBlueprint } from "../../blueprint/types";

export class LogicalConsistencyValidator implements ValidationRule {
  id = "validator:logic";
  name = "Logical Consistency Validator";
  category = "logic" as const;

  validate(blueprint: CategoryBlueprint): ValidationFinding[] {
    const findings: ValidationFinding[] = [];

    // Dummy check: if a combination is in both compatible and incompatible
    const compatibleIds = new Set(blueprint.compatibleCombinations.map(c => c.id));
    for (const inc of blueprint.incompatibleCombinations) {
      if (compatibleIds.has(inc.id)) {
        findings.push({
          id: crypto.randomUUID(),
          ruleId: this.id,
          category: this.category,
          severity: "error",
          message: `Cluster ${inc.id} is listed as both compatible and incompatible.`,
          affectedRules: []
        });
      }
    }

    return findings;
  }
}
