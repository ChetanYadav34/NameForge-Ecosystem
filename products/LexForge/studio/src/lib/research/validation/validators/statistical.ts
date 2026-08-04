import { ValidationRule, ValidationFinding } from "../types";
import { CategoryBlueprint } from "../../blueprint/types";

export class StatisticalValidator implements ValidationRule {
  id = "validator:statistics";
  name = "Statistical Validator";
  category = "statistics" as const;

  validate(blueprint: CategoryBlueprint): ValidationFinding[] {
    // Stub
    return [];
  }
}
