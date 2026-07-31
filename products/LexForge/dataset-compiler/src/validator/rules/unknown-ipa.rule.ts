// ============================================================================
// Validation Rule: Unknown IPA
// ============================================================================

import { SemanticWord, ValidationWarning, PipelineModuleMetadata } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Warns if any unknown IPA symbols were encountered during parsing.
 * Non-blocking rule.
 */
export class UnknownIpaRule implements ValidationRule {
  readonly name = "Unknown Ipa";
  readonly metadata: PipelineModuleMetadata = {
    id: "validator.rule.unknown-ipa",
    name: "UnknownIpaRule",
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
    if (record.unknownSymbols.length > 0) {
      return {
        word: record.word,
        rule: this.name,
        issue: `Unknown IPA symbols preserved: ${record.unknownSymbols.join(", ")}`,
      };
    }
    return null;
  }
}
