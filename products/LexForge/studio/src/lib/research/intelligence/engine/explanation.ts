import { PatternAssessment } from "../types";

export class ExplanationBuilder {
  build(assessments: PatternAssessment[]): string {
    const explanations = assessments
      .map(a => a.explanation)
      .filter(ex => ex.trim().length > 0);
      
    if (explanations.length === 0) {
      return "No sufficient intelligence gathered for this pattern.";
    }
    
    return explanations.join(" ");
  }

  buildEvidenceSummary(assessments: PatternAssessment[]): string {
    const allEvidence = new Set<string>();
    
    for (const assessment of assessments) {
      for (const ev of assessment.supportingEvidence) {
        allEvidence.add(ev);
      }
    }
    
    const count = allEvidence.size;
    if (count === 0) return "No direct evidence cited by analyzers.";
    if (count <= 3) return `Supported strongly by: ${Array.from(allEvidence).join(", ")}.`;
    return `Supported by ${count} distinct lines of evidence.`;
  }
}
