// ============================================================================
// Validation Rule: Duplicate Word
// ============================================================================

import { SemanticWord, ValidationWarning, PipelineModuleMetadata } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Detects duplicate words using the shared validation context.
 */
export class DuplicateWordRule implements ValidationRule {
  readonly name = "Duplicate Word";
  readonly metadata: PipelineModuleMetadata = {
    id: "validator.rule.duplicate-word",
    name: "DuplicateWordRule",
    version: "1.0.0",
    stage: "validate",
    priority: 60,
    requiresModules: [],
    requiresFeatures: [],
    producesFeatures: [],
    author: "LexForge",
  };

  readonly isBlocking = true;

  validate(record: SemanticWord, context: ValidationContext): ValidationWarning | null {
    if (context.seenWords.has(record.word)) {
      return { word: record.word, rule: this.name, issue: "Duplicate word" };
    }
    context.seenWords.add(record.word);
    return null;
  }
}
