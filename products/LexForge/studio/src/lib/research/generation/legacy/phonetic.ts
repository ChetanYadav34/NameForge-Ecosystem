import { CandidateBuilder, GenerationRuntime, CandidateFragment } from "../types";

export class PhoneticBuilder implements CandidateBuilder {
  id = "builder:phonetic";
  name = "Phonetic Builder";

  build(runtime: GenerationRuntime): CandidateFragment[] {
    const phonetics = runtime.plan.phoneticPreferences;
    const newFragments: CandidateFragment[] = [];

    for (const instruction of phonetics) {
      newFragments.push({
        id: crypto.randomUUID(),
        type: "phonetic",
        value: "k", // Mock phoneme
        instruction: instruction
      });
    }

    return newFragments;
  }
}
