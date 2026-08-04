import { IntelligenceAnalyzer, PatternAssessment } from "../types";
import { Pattern, CategoryDNA } from "../../dna/types";

export class CoverageAnalyzer implements IntelligenceAnalyzer {
  id = "intel:analyzer:coverage";
  name = "Coverage Analyzer";

  analyze(pattern: Pattern, context: CategoryDNA): PatternAssessment {
    // Stability comes from widespread coverage (not concentrated in a few words)
    const stability = Math.min(1.0, pattern.coverage * 2);
    
    return {
      analyzerId: this.id,
      importanceContribution: pattern.coverage,
      stabilityContribution: stability, 
      diversityContribution: 0,
      evidenceStrength: 0.9,
      confidenceContribution: stability > 0.5 ? 0.9 : 0.4,
      explanation: stability > 0.5 ? "Highly stable coverage across the vocabulary." : "Pattern coverage is fragmented.",
      supportingEvidence: []
    };
  }
}
