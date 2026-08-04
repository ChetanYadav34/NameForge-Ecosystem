import { CandidateBuilder, GenerationRuntime, CandidateFragment } from "../types";

export class SkeletonBuilder implements CandidateBuilder {
  id = "builder:skeleton";
  name = "Skeleton Builder";

  build(runtime: GenerationRuntime): CandidateFragment[] {
    const structures = runtime.plan.allowedStructures;
    const newFragments: CandidateFragment[] = [];

    // Base mock logic for generating a skeleton from structural rules.
    for (const instruction of structures) {
      newFragments.push({
        id: crypto.randomUUID(),
        type: "skeleton",
        value: "CVC", // Mock CV structure
        instruction: instruction
      });
    }

    return newFragments;
  }
}
