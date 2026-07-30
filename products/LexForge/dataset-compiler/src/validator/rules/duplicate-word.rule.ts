// ============================================================================
// Validation Rule: Duplicate Word
// ============================================================================

import { PhonologyWord, ValidationWarning } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Detects duplicate words using the shared validation context.
 */
export class DuplicateWordRule implements ValidationRule {
  readonly name = "duplicate-word";
  readonly isBlocking = true;

  validate(record: PhonologyWord, context: ValidationContext): ValidationWarning | null {
    if (context.seenWords.has(record.word)) {
      return { word: record.word, rule: this.name, issue: "Duplicate word" };
    }
    context.seenWords.add(record.word);
    return null;
  }
}
