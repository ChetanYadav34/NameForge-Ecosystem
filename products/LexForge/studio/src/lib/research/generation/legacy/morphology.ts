import { CandidateBuilder, GenerationRuntime, CandidateFragment } from "../types";

export class MorphologyBuilder implements CandidateBuilder {
  id = "builder:morphology";
  name = "Morphology Builder";

  build(runtime: GenerationRuntime): CandidateFragment[] {
    const morphology = runtime.plan.preferredMorphology;
    const newFragments: CandidateFragment[] = [];

    for (const instruction of morphology) {
      newFragments.push({
        id: crypto.randomUUID(),
        type: "morphology",
        value: "ex-", // Mock affix
        instruction: instruction
      });
    }

    return newFragments;
  }
}
