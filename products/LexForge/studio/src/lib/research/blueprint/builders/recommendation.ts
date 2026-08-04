import { BlueprintFragment, GenerationRule } from "../types";

export class RecommendationBuilder {
  buildRecommendations(fragments: BlueprintFragment[]): GenerationRule[] {
    const recommendations: GenerationRule[] = [];
    for (const frag of fragments) {
      if (frag.type === "recommendation") {
        recommendations.push({
          id: crypto.randomUUID(),
          type: "recommendation",
          description: frag.data.description || "Unspecified recommendation",
          signaturePatterns: frag.trace
        });
      }
    }
    return recommendations;
  }
}
