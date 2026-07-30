// ============================================================================
// Validation Rule: Phonology Counts
// ============================================================================

import { PhonologyWord, ValidationWarning } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Validates that phoneme counts match the actual array lengths,
 * and that vowels + consonants = total phonemes.
 * This ensures the parsing logic hasn't dropped or duplicated elements.
 * Blocking rule.
 */
export class PhonologyCountsRule implements ValidationRule {
  readonly name = "phonology-counts";
  readonly isBlocking = true;

  validate(record: PhonologyWord, _context: ValidationContext): ValidationWarning | null {
    if (record.phonemeCount !== record.phonemes.length) {
      return { word: record.word, rule: this.name, issue: "phonemeCount does not match phonemes.length" };
    }
    if (record.vowelCount !== record.vowels.length) {
      return { word: record.word, rule: this.name, issue: "vowelCount does not match vowels.length" };
    }
    if (record.consonantCount !== record.consonants.length) {
      return { word: record.word, rule: this.name, issue: "consonantCount does not match consonants.length" };
    }
    
    // Total valid phonemes = vowels + consonants (unknown symbols are preserved in phonemes array, 
    // but not in vowels/consonants arrays, so we must add unknownSymbols.length for the check)
    const expectedTotal = record.vowelCount + record.consonantCount + record.unknownSymbols.length;
    if (record.phonemeCount !== expectedTotal) {
      return { 
        word: record.word, 
        rule: this.name, 
        issue: `Phoneme math mismatch: ${record.vowelCount} (v) + ${record.consonantCount} (c) + ${record.unknownSymbols.length} (u) != ${record.phonemeCount} (total)` 
      };
    }

    return null;
  }
}
