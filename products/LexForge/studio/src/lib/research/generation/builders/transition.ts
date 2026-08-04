import { CandidateBuilder, GenerationRuntime, CandidateFragment } from "../types";

export class TransitionBuilder implements CandidateBuilder {
  id = "builder:transition";
  name = "Transition Builder";

  build(runtime: GenerationRuntime): CandidateFragment[] {
    const transitions = runtime.plan.preferredTransitions;
    const newFragments: CandidateFragment[] = [];

    for (const instruction of transitions) {
      newFragments.push({
        id: crypto.randomUUID(),
        type: "transition",
        value: "v-to-v", // Mock transition
        instruction: instruction
      });
    }

    return newFragments;
  }
}
