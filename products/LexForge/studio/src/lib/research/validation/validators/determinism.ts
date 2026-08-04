import { ValidationRule, ValidationFinding } from "../types";
import { CategoryBlueprint } from "../../blueprint/types";

export class DeterminismValidator implements ValidationRule {
  id = "validator:determinism";
  name = "Determinism Validator";
  category = "determinism" as const;

  validate(blueprint: CategoryBlueprint): ValidationFinding[] {
    // Stub: Check if rules are too loose
    return [];
  }
}
