import { CandidateIR, PhonologicalIR, OrthographicIR } from "../models/ir";
import { PlannerContext } from "./assembler";

export class CandidateMutationEngine {
  public readonly id = "planner:mutator:default";

  /**
   * Attempts to mutate a rejected candidate to rescue it.
   */
  public mutate(candidate: CandidateIR, context: PlannerContext): CandidateIR[] {
    const mutants: CandidateIR[] = [];

    // Strategy 1: Vowel Substitution
    // If the candidate has vowels, pick one and replace it with another vowel deterministically
    const vowels = context.plugin.getPhonemes().filter(p => p.manner === "vowel");
    if (vowels.length > 0) {
      const candidatePhonemes = [...candidate.candidate.phonology];
      
      for (let i = 0; i < candidatePhonemes.length; i++) {
        if (candidatePhonemes[i].manner === "vowel") {
          const alternateVowel = context.rng.select(vowels) as typeof candidatePhonemes[0];
          if (alternateVowel && alternateVowel.id !== candidatePhonemes[i].id) {
            const mutatedPhonemes = [...candidatePhonemes];
            mutatedPhonemes[i] = alternateVowel;
            
            // Re-generate orthography for mutated phonemes
            const newOrthography = context.plugin.mapOrthography(mutatedPhonemes);
            
            mutants.push({
              id: crypto.randomUUID(),
              sourceOrthographicId: candidate.sourceOrthographicId,
              candidate: {
                ...candidate.candidate,
                id: crypto.randomUUID(),
                phonology: mutatedPhonemes,
                orthography: newOrthography
                // syllables would ideally be re-parsed, skipping for MVP structural simplicity
              }
            });
          }
        }
      }
    }
    
    // Strategy 2: Coda dropping
    // Drop the final consonant if it exists
    const candidatePhonemes = [...candidate.candidate.phonology];
    if (candidatePhonemes.length > 0 && candidatePhonemes[candidatePhonemes.length - 1].manner !== "vowel") {
      const mutatedPhonemes = candidatePhonemes.slice(0, -1);
      const newOrthography = context.plugin.mapOrthography(mutatedPhonemes);
      mutants.push({
        id: crypto.randomUUID(),
        sourceOrthographicId: candidate.sourceOrthographicId,
        candidate: {
          ...candidate.candidate,
          id: crypto.randomUUID(),
          phonology: mutatedPhonemes,
          orthography: newOrthography
        }
      });
    }

    return mutants;
  }
}
