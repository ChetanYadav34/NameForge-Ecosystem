import { IntelligenceAnalyzer, PatternAssessment } from "../types";
import { Pattern, CategoryDNA } from "../../dna/types";

export class MorphologicalImportanceAnalyzer implements IntelligenceAnalyzer {
  id = "intel:analyzer:morphology";
  name = "Morphological Importance Analyzer";

  analyze(pattern: Pattern, context: CategoryDNA): PatternAssessment {
    // Check if this pattern exists in morphological DNA
    // For a real implementation, we'd cross-reference, but we can look for clues in metadata or value
    const isMorph = pattern.metadata?.length || pattern.value.toString().length >= 3;
    
    if (!isMorph) {
      return {
        analyzerId: this.id,
        importanceContribution: 0,
        stabilityContribution: 0,
        diversityContribution: 0,
        evidenceStrength: 0,
        confidenceContribution: 0,
        explanation: "",
        supportingEvidence: []
      };
    }

    // A pattern that occurs as an affix is highly important to category structure
    const importance = Math.min(1.0, pattern.coverage * 1.8);

    return {
      analyzerId: this.id,
      importanceContribution: importance,
      stabilityContribution: importance * 0.8, 
      diversityContribution: 0.6,
      evidenceStrength: 0.8,
      confidenceContribution: 0.8,
      explanation: `Productive morphological structure.`,
      supportingEvidence: []
    };
  }
}
