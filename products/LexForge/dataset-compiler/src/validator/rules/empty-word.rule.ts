// ============================================================================
// Validation Rule: Empty Word
// ============================================================================

import { PhonologyWord, ValidationWarning } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Rejects records with empty word strings.
 */
export class EmptyWordRule implements ValidationRule {
  readonly name = "empty-word";
  readonly isBlocking = true;

  validate(record: PhonologyWord, _context: ValidationContext): ValidationWarning | null {
    if (record.word.length === 0) {
      return { word: "(empty)", rule: this.name, issue: "Empty word string" };
    }
    return null;
  }
}
