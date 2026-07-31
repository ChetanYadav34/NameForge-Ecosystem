// ============================================================================
// Validation Rule: ARPABET Validation
// ============================================================================

import { SemanticWord, ValidationWarning, PipelineModuleMetadata } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Valid ARPABET phonemes (without stress markers).
 * Source: CMU Pronouncing Dictionary specification.
 */
const VALID_ARPABET_PHONEMES = new Set([
  // Vowels
  "AA", "AE", "AH", "AO", "AW", "AX", "AXR", "AY",
  "EH", "ER", "EY",
  "IH", "IX", "IY",
  "OW", "OY",
  "UH", "UW", "UX",
  // Consonants
  "B", "CH", "D", "DH", "DX",
  "EL", "EM", "EN",
  "F", "G", "HH",
  "JH", "K", "L", "M", "N", "NG", "NX",
  "P", "Q", "R", "S", "SH",
  "T", "TH",
  "V", "W", "WH",
  "Y", "Z", "ZH",
]);

/**
 * Check if an ARPABET phoneme token is valid.
 * Vowels may have a stress marker (0, 1, or 2) appended.
 */
function isValidArpabetToken(token: string): boolean {
  if (VALID_ARPABET_PHONEMES.has(token)) {
    return true;
  }

  if (token.length >= 2) {
    const lastChar = token[token.length - 1];
    if (lastChar === "0" || lastChar === "1" || lastChar === "2") {
      const base = token.substring(0, token.length - 1);
      return VALID_ARPABET_PHONEMES.has(base);
    }
  }

  return false;
}

/**
 * Validates ARPABET pronunciation tokens against the phoneme specification.
 * Checks both primary and alternate pronunciations.
 * This is informational only — the record is still considered valid.
 */
export class ArpabetRule implements ValidationRule {
  readonly name = "Arpabet";
  readonly metadata: PipelineModuleMetadata = {
    id: "validator.rule.arpabet",
    name: "ArpabetRule",
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
    // Validate primary pronunciation
    if (record.arpabet.length > 0) {
      const tokens = record.arpabet.split(/\s+/);
      for (const token of tokens) {
        if (!isValidArpabetToken(token)) {
          return {
            word: record.word,
            rule: this.name,
            issue: `Invalid ARPABET token "${token}"`,
          };
        }
      }
    }

    // Validate alternate pronunciations
    for (const alt of record.alternatePronunciations) {
      const tokens = alt.split(/\s+/);
      for (const token of tokens) {
        if (!isValidArpabetToken(token)) {
          return {
            word: record.word,
            rule: this.name,
            issue: `Alternate pronunciation: invalid ARPABET token "${token}"`,
          };
        }
      }
    }

    return null;
  }
}
