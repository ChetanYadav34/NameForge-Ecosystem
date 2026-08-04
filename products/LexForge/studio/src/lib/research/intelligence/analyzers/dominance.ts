import { IntelligenceAnalyzer, PatternAssessment } from "../types";
import { Pattern, CategoryDNA } from "../../dna/types";

export class DominanceAnalyzer implements IntelligenceAnalyzer {
  id = "intel:analyzer:dominance";
  name = "Dominance Analyzer";

  analyze(pattern: Pattern, context: CategoryDNA): PatternAssessment {
    // Dominance assesses importance based on raw frequency and coverage.
    // High frequency + high coverage = dominant.
    
    // Normalize frequency (dummy max assumed here for example, though coverage is better)
    // We rely heavily on coverage (0.0 to 1.0)
    const importance = Math.min(1.0, pattern.coverage * 1.5);
    
    return {
      analyzerId: this.id,
      importanceContribution: importance,
      stabilityContribution: pattern.coverage, 
      diversityContribution: 0, // Doesn't assess diversity
      evidenceStrength: 0.8,    // High inherent strength since frequency is a hard fact
      confidenceContribution: 0.9,
      explanation: `Dominance scored at ${(importance * 100).toFixed(1)}% based on coverage of ${(pattern.coverage * 100).toFixed(1)}%.`,
      supportingEvidence: ["High coverage in vocabulary indicates dominance."]
    };
  }
}
