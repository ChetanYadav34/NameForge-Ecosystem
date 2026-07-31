// ============================================================================
// Validation Rule: Empty Word
// ============================================================================

import { SemanticWord, ValidationWarning, PipelineModuleMetadata } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Rejects records with empty word strings.
 */
export class EmptyWordRule implements ValidationRule {
  readonly name = "Empty Word";
  readonly metadata: PipelineModuleMetadata = {
    id: "validator.rule.empty-word",
    name: "EmptyWordRule",
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
    if (record.word.length === 0) {
      return { word: "(empty)", rule: this.name, issue: "Empty word string" };
    }
    return null;
  }
}
