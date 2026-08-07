import { LinguisticCandidate } from "../../../models/types";

export interface EvaluatorContext {
  readonly candidate: LinguisticCandidate;
}

export interface IEvaluator {
  readonly id: string;
  readonly name: string;
  evaluate(context: EvaluatorContext): number; // Returns 0 to 1
}

/**
 * Checks for illegal onset consonant clusters in English.
 */
export class OnsetLegalityEvaluator implements IEvaluator {
  readonly id = "eval:en:onset-legality";
  readonly name = "Onset Legality";

  evaluate(context: EvaluatorContext): number {
    let score = 1.0;
    for (const syl of context.candidate.syllables) {
      if (syl.onset.length > 2) {
        score *= 0.5; // Penalize heavy clusters
      }
    }
    return score;
  }
}

/**
 * Evaluates the transition smoothness between syllables.
 */
export class TransitionQualityEvaluator implements IEvaluator {
  readonly id = "eval:en:transition-quality";
  readonly name = "Transition Quality";

  evaluate(context: EvaluatorContext): number {
    let score = 1.0;
    const syllables = context.candidate.syllables;
    for (let i = 0; i < syllables.length - 1; i++) {
      const coda = syllables[i].coda;
      const nextOnset = syllables[i + 1].onset;
      
      // If a coda ends in a plosive and next onset starts with a plosive (e.g. /kt/ transition)
      if (coda.length > 0 && nextOnset.length > 0) {
        if (coda[coda.length - 1].manner === "plosive" && nextOnset[0].manner === "plosive") {
          score *= 0.7; // Hard transition penalty
        }
      }
    }
    return score;
  }
}

/**
 * Evaluates how balanced the syllables are (weight distribution).
 */
export class SyllableBalanceEvaluator implements IEvaluator {
  readonly id = "eval:en:syllable-balance";
  readonly name = "Syllable Balance";

  evaluate(context: EvaluatorContext): number {
    const syllables = context.candidate.syllables;
    if (syllables.length === 1) return 1.0; // Monosyllabic is fine

    const heavyCount = syllables.filter((s: any) => s.weight === "heavy").length;
    
    // Penalize if all syllables are heavy
    if (heavyCount === syllables.length) return 0.6;
    
    return 1.0;
  }
}

/**
 * Evaluates orthographic complexity.
 */
export class OrthographicQualityEvaluator implements IEvaluator {
  readonly id = "eval:en:orthographic-quality";
  readonly name = "Orthographic Quality";

  evaluate(context: EvaluatorContext): number {
    const orth = context.candidate.orthography;
    if (orth.length > 12) return 0.5;
    if (orth.length < 3) return 0.7;
    return 1.0;
  }
}
