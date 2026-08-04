import { QualityMetrics, ValidationFinding, ValidationCategory } from "../types";

export class QualityMetricsBuilder {
  build(groupedFindings: Record<ValidationCategory, ValidationFinding[]>): QualityMetrics {
    // A simplistic metric calculation for MVP.
    // 1.0 means perfect (no negative findings).
    // Penalize based on the number and severity of findings in each category.

    const calculateScore = (category: ValidationCategory): number => {
      const findings = groupedFindings[category] || [];
      let penalty = 0;
      for (const finding of findings) {
        if (finding.severity === "critical") penalty += 0.5;
        if (finding.severity === "error") penalty += 0.3;
        if (finding.severity === "warning") penalty += 0.1;
      }
      return Math.max(0.0, 1.0 - penalty);
    };

    return {
      completeness: calculateScore("completeness"),
      consistency: calculateScore("logic"),
      evidenceIntegrity: calculateScore("evidence"),
      ruleDensity: 1.0, // Hard to assess negatively without specific rule logic, assume 1.0 for now
      conflictScore: calculateScore("conflict"),
      confidenceReliability: calculateScore("confidence"),
      coverageScore: calculateScore("structure"), 
      traceabilityScore: calculateScore("evidence"), // Maps to evidence
      determinismScore: calculateScore("determinism"),
      generationReadiness: calculateScore("readiness")
    };
  }
}
