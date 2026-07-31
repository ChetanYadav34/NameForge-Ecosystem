// ============================================================================
// LexForge Dataset Compiler — Validator
// ============================================================================
// Rule-based validation engine.
//
// The validator runs a set of registered ValidationRule implementations
// against each record. Rules can be added or removed without modifying
// this file — just register them in the rules array.
//
// Rules are categorized as:
//   • Blocking: a warning from this rule marks the record as invalid
//   • Non-blocking: informational warning, record still counts as valid
// ============================================================================

import { FamilyWord, ValidationReport, ValidationWarning } from "../types/index.js";
import { ValidationRule, createValidationContext } from "./rules/base.rule.js";
import { EmptyWordRule } from "./rules/empty-word.rule.js";
import { DuplicateWordRule } from "./rules/duplicate-word.rule.js";
import { NonAlphabeticRule } from "./rules/non-alphabetic.rule.js";
import { ArpabetRule } from "./rules/arpabet.rule.js";
import { IpaPresenceRule } from "./rules/ipa-presence.rule.js";
import { PhonologyCountsRule } from "./rules/phonology-counts.rule.js";
import { HasVowelRule } from "./rules/has-vowel.rule.js";
import { UnknownIpaRule } from "./rules/unknown-ipa.rule.js";
import { StressPatternRule } from "./rules/stress-pattern.rule.js";
import { UniqueSemanticsRule } from "./rules/unique-semantics.rule.js";
import { NoEmptySemanticsRule } from "./rules/no-empty-semantics.rule.js";
import { MorphologyRule } from "./rules/morphology.rule.js";
import { logger } from "../utils/logger.js";

/**
 * Default set of validation rules.
 * Order matters: blocking rules run first so we can skip non-blocking
 * checks on records that are already invalid.
 */
function getDefaultRules(): ValidationRule[] {
  return [
    // Blocking rules
    new EmptyWordRule(),
    new DuplicateWordRule(),
    new PhonologyCountsRule(),
    new StressPatternRule(),
    new UniqueSemanticsRule(),
    new NoEmptySemanticsRule(),
    new MorphologyRule(),
    // Non-blocking rules
    new NonAlphabeticRule(),
    new ArpabetRule(),
    new IpaPresenceRule(),
    new HasVowelRule(),
    new UnknownIpaRule(),
  ];
}

/**
 * Validate a batch of records against all registered rules.
 *
 * @param records - Semantic/Morphology word records to validate
 * @param rules - Optional custom rule set
 * @returns A full ValidationReport containing all warnings.
 */
export function validate(
  records: FamilyWord[],
  rules?: ValidationRule[]
): ValidationReport {
  logger.info("Validating records...");

  const activeRules = rules ?? getDefaultRules();
  const context = createValidationContext();
  const warnings: ValidationWarning[] = [];
  let validRecords = 0;

  logger.info(`${activeRules.length} validation rules registered`);

  for (const record of records) {
    let isValid = true;

    for (const rule of activeRules) {
      const warning = rule.validate(record, context);

      if (warning) {
        warnings.push(warning);

        if (rule.isBlocking) {
          isValid = false;
          break; // Skip remaining rules for this record
        }
      }
    }

    if (isValid) {
      validRecords++;
    }
  }

  logger.success(`Validation complete: ${validRecords.toLocaleString()} valid records`);

  if (warnings.length > 0) {
    logger.warn(`${warnings.length.toLocaleString()} warning(s) generated`);

    // Log first few warnings as examples
    const previewCount = Math.min(warnings.length, 5);
    for (let i = 0; i < previewCount; i++) {
      logger.info(`  [${warnings[i].rule}] "${warnings[i].word}": ${warnings[i].issue}`);
    }
    if (warnings.length > previewCount) {
      logger.info(`  ... and ${warnings.length - previewCount} more`);
    }
  }

  return {
    totalRecords: records.length,
    validRecords,
    warnings,
  };
}
