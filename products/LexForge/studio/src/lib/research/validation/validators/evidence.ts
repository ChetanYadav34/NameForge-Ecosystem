import { ValidationRule, ValidationFinding } from "../types";
import { CategoryBlueprint, GenerationRule } from "../../blueprint/types";

export class EvidenceValidator implements ValidationRule {
  id = "validator:evidence";
  name = "Evidence Validator";
  category = "evidence" as const;

  validate(blueprint: CategoryBlueprint): ValidationFinding[] {
    const findings: ValidationFinding[] = [];

    const checkRules = (rules: GenerationRule[], listName: string) => {
      for (const rule of rules) {
        if (!rule.signaturePatterns || rule.signaturePatterns.length === 0) {
          findings.push({
            id: crypto.randomUUID(),
            ruleId: this.id,
            category: this.category,
            severity: "warning",
            message: `Rule ${rule.id} in ${listName} has no underlying evidence.`,
            affectedRules: [rule]
          });
        }
      }
    };

    checkRules(blueprint.preferredStructures, "preferredStructures");
    checkRules(blueprint.preferredPhoneticFlows, "preferredPhoneticFlows");
    checkRules(blueprint.preferredMorphology, "preferredMorphology");
    checkRules(blueprint.preferredTransitions, "preferredTransitions");
    checkRules(blueprint.generationConstraints, "generationConstraints");
    checkRules(blueprint.generationRecommendations, "generationRecommendations");

    return findings;
  }
}
