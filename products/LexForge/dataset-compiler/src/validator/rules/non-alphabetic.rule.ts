// ============================================================================
// Validation Rule: Non-Alphabetic Characters
// ============================================================================

import { SemanticWord, ValidationWarning, PipelineModuleMetadata } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Warns when a word contains non-alphabetic characters.
 * This is informational only — the record is still considered valid.
 */
export class NonAlphabeticRule implements ValidationRule {
  readonly name = "Non Alphabetic";
  readonly metadata: PipelineModuleMetadata = {
    id: "validator.rule.non-alphabetic",
    name: "NonAlphabeticRule",
    version: "1.0.0",
    stage: "validate",
    priority: 60,
    requiresModules: [],
    requiresFeatures: [],
    producesFeatures: [],
    author: "LexForge",
  };

  readonly isBlocking = false;

  validate(record: SemanticWord, _context: ValidationContext): ValidationWarning | null {
    if (record.word.length > 0 && !/^[a-zA-Z]+$/.test(record.word)) {
      return {
        word: record.word,
        rule: this.name,
        issue: "Contains non-alphabetic characters",
      };
    }
    return null;
  }
}
