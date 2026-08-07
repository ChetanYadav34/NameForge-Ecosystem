import { CandidateBuilder, GenerationRuntime, CandidateFragment } from "../types";

export class ClusterBuilder implements CandidateBuilder {
  id = "builder:cluster";
  name = "Cluster Builder";

  build(runtime: GenerationRuntime): CandidateFragment[] {
    const reqClusters = runtime.plan.requiredClusters;
    const newFragments: CandidateFragment[] = [];

    for (const instruction of reqClusters) {
      newFragments.push({
        id: crypto.randomUUID(),
        type: "cluster",
        value: "str", // Mock cluster
        instruction: instruction
      });
    }

    return newFragments;
  }
}
