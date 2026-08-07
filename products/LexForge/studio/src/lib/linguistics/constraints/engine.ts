import { Constraint, ConstraintContext, ValidationResult } from "./types";

/**
 * Universal Constraint Engine.
 * Responsible for evaluating constraints and executing CSP pruning.
 */
export class ConstraintSolver {
  private constraints: Constraint[] = [];

  /**
   * Registers a constraint into the engine.
   */
  public register(constraint: Constraint): void {
    if (!this.constraints.some((c) => c.id === constraint.id)) {
      this.constraints.push(constraint);
    }
  }

  /**
   * Evaluates the current context against all active constraints.
   * If a hard constraint fails, execution immediately halts and returns invalid.
   */
  public solve(context: ConstraintContext): ValidationResult {
    const triggered = [];
    let totalPenalty = 0;

    for (const constraint of this.constraints) {
      const result = constraint.evaluate(context);
      
      if (!result.isValid) {
        triggered.push(result);
        
        if (result.severity === "hard") {
          // CSP Early Pruning: Stop evaluating immediately upon hard constraint failure
          return {
            isValid: false,
            triggeredConstraints: triggered,
            totalPenalty: 0
          };
        } else if (result.penalty) {
          totalPenalty += result.penalty;
        }
      }
    }

    return {
      isValid: true,
      triggeredConstraints: triggered,
      totalPenalty
    };
  }

  /**
   * Clears all registered constraints.
   */
  public clear(): void {
    this.constraints = [];
  }
}
