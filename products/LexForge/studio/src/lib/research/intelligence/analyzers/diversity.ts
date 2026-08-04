import { IntelligenceAnalyzer, PatternAssessment } from "../types";
import { Pattern, CategoryDNA } from "../../dna/types";

export class DiversityAnalyzer implements IntelligenceAnalyzer {
  id = "intel:analyzer:diversity";
  name = "Diversity Analyzer";

  analyze(pattern: Pattern, context: CategoryDNA): PatternAssessment {
    // True diversity requires checking the distinctness of supporting words.
    // As a naive proxy: if it supports many words relative to frequency, it's diverse.
    const diversityRatio = pattern.frequency > 0 ? pattern.supportingWords.length / pattern.frequency : 0;
    
    // 1.0 means every occurrence is in a unique word (highly diverse).
    const diversity = Math.min(1.0, diversityRatio);
    
    return {
      analyzerId: this.id,
      importanceContribution: diversity * 0.5,
      stabilityContribution: diversity * 0.8, 
      diversityContribution: diversity,
      evidenceStrength: 0.7,
      confidenceContribution: diversity,
      explanation: `Lexical diversity score: ${(diversity * 100).toFixed(1)}%.`,
      supportingEvidence: []
    };
  }
}
