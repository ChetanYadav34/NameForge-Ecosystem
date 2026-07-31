import { MorphologyWord, ValidationWarning, PipelineModuleMetadata } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Validates morphological fields introduced by Hunspell.
 */
export class MorphologyRule implements ValidationRule {
  readonly name = "Morphology Validation";
  readonly metadata: PipelineModuleMetadata = {
    id: "validator.rule.morphology",
    name: "MorphologyRule",
    version: "1.0.0",
    stage: "validate",
    priority: 65,
    requiresModules: ["enricher.hunspell"],
    requiresFeatures: ["feature.lemma", "feature.inflections", "feature.derivations"],
    producesFeatures: [],
    author: "LexForge",
  };

  readonly isBlocking = true;

  validate(record: MorphologyWord, _context: ValidationContext): ValidationWarning | null {
    if (record.lemma !== undefined && record.lemma.trim().length === 0) {
      return { word: record.word, rule: this.name, issue: "Lemma is present but empty" };
    }

    if (record.stem !== undefined && record.stem.trim().length === 0) {
      return { word: record.word, rule: this.name, issue: "Stem is present but empty" };
    }

    if (record.inflections) {
      const uniqueInflections = new Set(record.inflections);
      if (uniqueInflections.size !== record.inflections.length) {
        return { word: record.word, rule: this.name, issue: "Duplicate inflections found" };
      }
    }

    if (record.derivations) {
      const uniqueDerivations = new Set(record.derivations);
      if (uniqueDerivations.size !== record.derivations.length) {
        return { word: record.word, rule: this.name, issue: "Duplicate derivations found" };
      }
    }

    return null;
  }
}
