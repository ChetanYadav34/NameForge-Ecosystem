// ============================================================================
// Validation Rule: Stress Pattern
// ============================================================================

import { SemanticWord, ValidationWarning, PipelineModuleMetadata } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Validates that stressPattern.length == vowelCount.
 * Blocking rule.
 */
export class StressPatternRule implements ValidationRule {
  readonly name = "Stress Pattern";
  readonly metadata: PipelineModuleMetadata = {
    id: "validator.rule.stress-pattern",
    name: "StressPatternRule",
    version: "1.0.0",
    stage: "validate",
    priority: 60,
    requiresModules: [],
    requiresFeatures: [],
    producesFeatures: [],
    author: "LexForge",
  };

  readonly isBlocking = true;

  validate(record: SemanticWord, _context: ValidationContext): ValidationWarning | null {
    if (record.ipa.length > 0 && record.stressPattern.length !== record.vowelCount) {
      return {
        word: record.word,
        rule: this.name,
        issue: `Stress pattern length (${record.stressPattern.length}) does not match vowel count (${record.vowelCount})`,
      };
    }
    return null;
  }
}
