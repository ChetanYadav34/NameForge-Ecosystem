import { BlueprintAnalyzer, BlueprintFragment } from "../types";
import { CategorySignature } from "../../intelligence/types";

export class RecommendationAnalyzer implements BlueprintAnalyzer {
  id = "blueprint:analyzer:recommendation";
  name = "Recommendation Analyzer";

  analyze(signature: CategorySignature): BlueprintFragment[] {
    const fragments: BlueprintFragment[] = [];
    
    // Rare but high importance patterns can be recommendations for flavor
    const flavorPatterns = [
      ...signature.classifiedPatterns.phonetic,
      ...signature.classifiedPatterns.semantic
    ].filter(p => p.classification === "rare" && p.aggregatedScores.importance > 0.4);

    if (flavorPatterns.length > 0) {
      fragments.push({
        type: "recommendation",
        data: { description: "Inject rare high-importance patterns for distinct flavor." },
        trace: flavorPatterns
      });
    }

    return fragments;
  }
}
