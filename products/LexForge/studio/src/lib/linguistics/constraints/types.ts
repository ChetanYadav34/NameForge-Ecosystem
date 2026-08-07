import { CandidateIR, PhonologicalIR, MorphologicalIR } from "../models/ir";

export type ConstraintSeverity = "hard" | "soft";

export interface ConstraintContext {
  readonly currentPhonology?: PhonologicalIR;
  readonly currentCandidate?: CandidateIR;
  readonly morphological?: MorphologicalIR;
}

export interface ConstraintResult {
  readonly constraintId: string;
  readonly isValid: boolean;
  readonly severity: ConstraintSeverity;
  readonly penalty?: number; // Used if soft constraint fails (e.g. 0.1 to 1.0)
  readonly explanation?: string;
}

/**
 * A discrete validation rule evaluated by the Constraint Engine.
 */
export interface Constraint {
  readonly id: string;
  readonly name: string;
  readonly severity: ConstraintSeverity;
  
  /**
   * Evaluates the constraint against the current context.
   */
  evaluate(context: ConstraintContext): ConstraintResult;
}

/**
 * The consolidated result of evaluating all active constraints.
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly triggeredConstraints: ConstraintResult[];
  readonly totalPenalty: number;
}
