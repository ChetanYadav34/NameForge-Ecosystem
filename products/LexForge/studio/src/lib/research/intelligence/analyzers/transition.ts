import { IntelligenceAnalyzer, PatternAssessment } from "../types";
import { Pattern, CategoryDNA } from "../../dna/types";

export class TransitionImportanceAnalyzer implements IntelligenceAnalyzer {
  id = "intel:analyzer:transition";
  name = "Transition Importance Analyzer";

  analyze(pattern: Pattern, context: CategoryDNA): PatternAssessment {
    // Specifically checks if this is a transition pattern
    const isTransition = pattern.value.toString().includes("->");
    
    if (!isTransition) {
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

    const importance = Math.min(1.0, pattern.coverage * 2.5); // Boost transition importance based on coverage

    return {
      analyzerId: this.id,
      importanceContribution: importance,
      stabilityContribution: importance * 0.9, 
      diversityContribution: 0.5,
      evidenceStrength: 0.9,
      confidenceContribution: 0.9,
      explanation: `Strong transition pattern forming continuous phonetic/orthographic movement.`,
      supportingEvidence: []
    };
  }
}
