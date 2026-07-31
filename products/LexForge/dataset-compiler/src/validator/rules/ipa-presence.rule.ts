// ============================================================================
// Validation Rule: IPA Presence
// ============================================================================

import { SemanticWord, ValidationWarning, PipelineModuleMetadata } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Warns when a word has an ARPABET pronunciation but no IPA was generated.
 * This catches cases where the ARPABET→IPA transformation failed silently.
 * Informational only — does not block the record.
 */
export class IpaPresenceRule implements ValidationRule {
  readonly name = "Ipa Presence";
  readonly metadata: PipelineModuleMetadata = {
    id: "validator.rule.ipa-presence",
    name: "IpaPresenceRule",
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
    if (record.arpabet.length > 0 && record.ipa.length === 0) {
      return {
        word: record.word,
        rule: this.name,
        issue: "ARPABET pronunciation exists but IPA is empty",
      };
    }
    return null;
  }
}
