// ============================================================================
// Validation Rule: Unknown IPA
// ============================================================================

import { PhonologyWord, ValidationWarning } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Warns if any unknown IPA symbols were encountered during parsing.
 * Non-blocking rule.
 */
export class UnknownIpaRule implements ValidationRule {
  readonly name = "unknown-ipa";
  readonly isBlocking = false;

  validate(record: PhonologyWord, _context: ValidationContext): ValidationWarning | null {
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
