import { IntelligenceAnalyzer, PatternAssessment } from "../types";
import { Pattern, CategoryDNA } from "../../dna/types";

export class PhoneticImportanceAnalyzer implements IntelligenceAnalyzer {
  id = "intel:analyzer:phonetic";
  name = "Phonetic Importance Analyzer";

  analyze(pattern: Pattern, context: CategoryDNA): PatternAssessment {
    // True IPA/phonetic check would be more robust.
    // For now, if the pattern looks like an IPA symbol or onset cluster, boost it.
    const isPhonetic = pattern.value.toString().length <= 3; // very naive proxy
    
    if (!isPhonetic) {
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

    const importance = Math.min(1.0, pattern.coverage * 1.5);

    return {
      analyzerId: this.id,
      importanceContribution: importance,
      stabilityContribution: importance * 0.7, 
      diversityContribution: 0.5,
      evidenceStrength: 0.8,
      confidenceContribution: 0.8,
      explanation: `Acoustically prominent phonetic feature.`,
      supportingEvidence: []
    };
  }
}
