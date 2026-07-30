// ============================================================================
// Validation Rule: Stress Pattern
// ============================================================================

import { PhonologyWord, ValidationWarning } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Validates that stressPattern.length == vowelCount.
 * Blocking rule.
 */
export class StressPatternRule implements ValidationRule {
  readonly name = "stress-pattern";
  readonly isBlocking = true;

  validate(record: PhonologyWord, _context: ValidationContext): ValidationWarning | null {
    if (record.ipa.length > 0 && record.stressPattern.length !== record.vowelCount) {
      return {
        word: record.word,
        rule: this.name,
        issue: `Stress pattern length (${record.stressPattern.length}) does not match vowel count (${record.vowelCount})`,
      };
    }
    return null;
  }
}
