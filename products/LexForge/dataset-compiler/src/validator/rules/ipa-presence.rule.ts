// ============================================================================
// Validation Rule: IPA Presence
// ============================================================================

import { PhonologyWord, ValidationWarning } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Warns when a word has an ARPABET pronunciation but no IPA was generated.
 * This catches cases where the ARPABET→IPA transformation failed silently.
 * Informational only — does not block the record.
 */
export class IpaPresenceRule implements ValidationRule {
  readonly name = "ipa-presence";
  readonly isBlocking = false;

  validate(record: PhonologyWord, _context: ValidationContext): ValidationWarning | null {
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
