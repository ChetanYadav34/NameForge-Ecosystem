import { MorphologicalIR, PhonologicalIR } from "../models/ir";
import { IPlanner, PlannerContext } from "./assembler";
import { Syllable, Phoneme } from "../models/types";

export class PhonologyPlanner implements IPlanner<MorphologicalIR, PhonologicalIR> {
  public readonly id = "planner:phonology:baseline";

  public compile(input: MorphologicalIR, context: PlannerContext): PhonologicalIR[] {
    // Basic Phase 23 Phonology generator.
    // Generates a simple CV-CVC structure using the language plugin.
    
    const phonemes = context.plugin.getPhonemes();
    const consonants = phonemes.filter(p => p.manner !== "vowel");
    const vowels = phonemes.filter(p => p.manner === "vowel");

    if (consonants.length === 0 || vowels.length === 0) return [];

    // Deterministically pick sounds
    const c1 = context.rng.select(consonants) as Phoneme;
    const v1 = context.rng.select(vowels) as Phoneme;
    const c2 = context.rng.select(consonants) as Phoneme;
    const v2 = context.rng.select(vowels) as Phoneme;

    const dummyMetadata = { frequency: 0.1, rarity: 0.9, productivity: 0.5, confidence: 1.0, source: "generator", version: "1.0.0" };
    const s1: Syllable = { id: crypto.randomUUID(), onset: [c1], nucleus: [v1], coda: [], weight: "light", metadata: dummyMetadata };
    const s2: Syllable = { id: crypto.randomUUID(), onset: [c2], nucleus: [v2], coda: [], weight: "light", metadata: dummyMetadata };

    const sequence = [...s1.onset, ...s1.nucleus, ...s1.coda, ...s2.onset, ...s2.nucleus, ...s2.coda];

    // Constraint Solver Check (CSP early pruning)
    const validation = context.solver.solve({ currentPhonology: undefined }); // Mock context
    if (!validation.isValid) {
      return []; // Branch pruned
    }

    return [{
      id: crypto.randomUUID(),
      sourceMorphologicalId: input.id,
      targetSyllables: 2,
      syllables: [s1, s2],
      phonemeSequence: sequence
    }];
  }
}
