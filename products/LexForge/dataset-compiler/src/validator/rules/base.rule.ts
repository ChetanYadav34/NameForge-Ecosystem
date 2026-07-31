// ============================================================================
// LexForge Dataset Compiler — Validation Rule Base
// ============================================================================
// Defines the contract for modular validation rules and shared context.
//
// To add a new validation rule:
//   1. Create a new file in this directory
//   2. Implement the ValidationRule interface
//   3. Register it in validator.ts
//
// No existing code needs to be modified.
// ============================================================================

import { FamilyWord, ValidationWarning, PipelineModule } from "../../types/index.js";

/**
 * Shared context passed to every validation rule.
 * Rules can read from and write to this context to share state
 * (e.g., tracking seen words for duplicate detection).
 */
export interface ValidationContext {
  /** Set of words already seen — used for duplicate detection. */
  seenWords: Set<string>;
}

/**
 * Creates a fresh validation context for a new validation run.
 */
export function createValidationContext(): ValidationContext {
  return {
    seenWords: new Set<string>(),
  };
}

/**
 * Contract that every validation rule must implement.
 *
 * Each rule inspects a single record and returns either:
 *   • A ValidationWarning if an issue is found
 *   • null if the record passes this rule
 *
 * Rules may read/write the shared ValidationContext for stateful checks.
 */
export interface ValidationRule<TRecord extends object = FamilyWord> extends PipelineModule {
  /** Human-readable name of this rule. */
  readonly name: string;

  /**
   * Whether a warning from this rule should mark the record as invalid.
   * If false, the warning is informational only (the record still counts as valid).
   */
  readonly isBlocking: boolean;

  /**
   * Validate a single record.
   *
   * @param record - The record to validate.
   * @param context - Shared context for stateful rules.
   * @returns A ValidationWarning if an issue is found, or null if the record passes.
   */
  validate(record: TRecord, context: ValidationContext): ValidationWarning | null;
}
