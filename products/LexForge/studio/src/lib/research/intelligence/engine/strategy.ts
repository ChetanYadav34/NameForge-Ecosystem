import { ClassificationStrategy, AggregatedScores, PatternClassification } from "../types";

export class DefaultClassificationStrategy implements ClassificationStrategy {
  id = "classification:default";
  name = "Default Tiered Classification";

  classify(scores: AggregatedScores): PatternClassification {
    const { importance, stability } = scores;
    
    // Core: Extremely high importance and stability
    if (importance >= 0.8 && stability >= 0.7) return "core";
    
    // Dominant: Very high importance
    if (importance >= 0.6) return "dominant";
    
    // Supporting: Decent stability and importance
    if (importance >= 0.3 && stability >= 0.4) return "supporting";
    
    // Rare: Very low stability but might have some importance
    if (stability < 0.2 && importance > 0.1) return "rare";
    
    // Noise: Almost non-existent signals
    return "noise";
  }
}
