import { Constraint, ConstraintContext, ConstraintResult } from "../../constraints/types";
import { Phoneme } from "../../models/types";

function extractSyllables(context: ConstraintContext) {
  return context.currentPhonology?.syllables || [];
}

/**
 * Enforces the Sonority Sequencing Principle (SSP).
 * Onset sonority must strictly rise. Coda sonority must strictly fall.
 */
export class SonoritySequencingConstraint implements Constraint {
  readonly id = "lang:en:ssp";
  readonly name = "Sonority Sequencing Principle";
  readonly severity = "hard";

  evaluate(context: ConstraintContext): ConstraintResult {
    const syllables = extractSyllables(context);
    
    for (const syl of syllables) {
      // Check onset (must strictly rise, ignoring exceptions for now)
      for (let i = 0; i < syl.onset.length - 1; i++) {
        if (syl.onset[i].sonority >= syl.onset[i + 1].sonority) {
          // Allow English Sibilant exception (/s/ + stop)
          if (syl.onset[i].ipa === "s" && syl.onset[i + 1].manner === "plosive" && i === 0) {
            continue;
          }
          return { constraintId: this.id, isValid: false, severity: this.severity, explanation: `SSP Violation in onset: /${syl.onset[i].ipa}/ to /${syl.onset[i+1].ipa}/` };
        }
      }

      // Check coda (must fall or stay flat, e.g. /kt/)
      for (let i = 0; i < syl.coda.length - 1; i++) {
        if (syl.coda[i].sonority < syl.coda[i + 1].sonority) {
          return { constraintId: this.id, isValid: false, severity: this.severity, explanation: `SSP Violation in coda: /${syl.coda[i].ipa}/ to /${syl.coda[i+1].ipa}/` };
        }
      }
    }

    return { constraintId: this.id, isValid: true, severity: this.severity };
  }
}

/**
 * Restricts complex clusters to English norms.
 * English allows up to 3 consonants in the onset.
 */
export class MaxOnsetConstraint implements Constraint {
  readonly id = "lang:en:max-onset";
  readonly name = "Maximum Onset Limit";
  readonly severity = "hard";

  evaluate(context: ConstraintContext): ConstraintResult {
    const syllables = extractSyllables(context);
    
    for (const syl of syllables) {
      if (syl.onset.length > 3) {
        return { constraintId: this.id, isValid: false, severity: this.severity, explanation: `Onset exceeds max length 3` };
      }
    }

    return { constraintId: this.id, isValid: true, severity: this.severity };
  }
}

/**
 * Restricts complex clusters to English norms.
 * English allows up to 4 consonants in the coda (e.g. "sixths" /sɪksθs/ -> k s θ s).
 */
export class MaxCodaConstraint implements Constraint {
  readonly id = "lang:en:max-coda";
  readonly name = "Maximum Coda Limit";
  readonly severity = "hard";

  evaluate(context: ConstraintContext): ConstraintResult {
    const syllables = extractSyllables(context);
    
    for (const syl of syllables) {
      if (syl.coda.length > 4) {
        return { constraintId: this.id, isValid: false, severity: this.severity, explanation: `Coda exceeds max length 4` };
      }
    }

    return { constraintId: this.id, isValid: true, severity: this.severity };
  }
}

/**
 * A combined export of standard English constraints.
 */
export const ENGLISH_CONSTRAINTS: Constraint[] = [
  new SonoritySequencingConstraint(),
  new MaxOnsetConstraint(),
  new MaxCodaConstraint()
];
