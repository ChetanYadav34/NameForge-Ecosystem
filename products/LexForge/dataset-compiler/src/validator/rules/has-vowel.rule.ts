// ============================================================================
// Validation Rule: Has Vowel
// ============================================================================

import { PhonologyWord, ValidationWarning } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Validates that every word with an IPA string has at least one vowel.
 * This catches parsing failures or highly anomalous words.
 * Non-blocking rule.
 */
export class HasVowelRule implements ValidationRule {
  readonly name = "has-vowel";
  readonly isBlocking = false;

  validate(record: PhonologyWord, _context: ValidationContext): ValidationWarning | null {
    if (record.ipa.length > 0 && record.vowelCount === 0) {
      return {
        word: record.word,
        rule: this.name,
        issue: "Word has IPA pronunciation but zero vowels",
      };
    }
    return null;
  }
}
