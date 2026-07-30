// ============================================================================
// Validation Rule: Non-Alphabetic Characters
// ============================================================================

import { PhonologyWord, ValidationWarning } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Warns when a word contains non-alphabetic characters.
 * This is informational only — the record is still considered valid.
 */
export class NonAlphabeticRule implements ValidationRule {
  readonly name = "non-alphabetic";
  readonly isBlocking = false;

  validate(record: PhonologyWord, _context: ValidationContext): ValidationWarning | null {
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
