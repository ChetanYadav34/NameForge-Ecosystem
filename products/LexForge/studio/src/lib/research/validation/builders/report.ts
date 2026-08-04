import { ValidationFinding, ValidationCategory, ValidationReport, QualityMetrics } from "../types";

export class ValidationReportBuilder {
  buildReports(
    groupedFindings: Record<ValidationCategory, ValidationFinding[]>,
    metrics: QualityMetrics
  ): Record<ValidationCategory, ValidationReport> {
    const buildReport = (category: ValidationCategory, score: number): ValidationReport => {
      const findings = groupedFindings[category] || [];
      const hasCriticalError = findings.some(f => f.severity === "critical" || f.severity === "error");
      
      return {
        category,
        passed: !hasCriticalError,
        score,
        findings
      };
    };

    return {
      structure: buildReport("structure", metrics.coverageScore),
      logic: buildReport("logic", metrics.consistency),
      evidence: buildReport("evidence", metrics.evidenceIntegrity),
      statistics: buildReport("statistics", 1.0), // Stub mapping
      determinism: buildReport("determinism", metrics.determinismScore),
      completeness: buildReport("completeness", metrics.completeness),
      readiness: buildReport("readiness", metrics.generationReadiness),
      confidence: buildReport("confidence", metrics.confidenceReliability),
      conflict: buildReport("conflict", metrics.conflictScore)
    };
  }
}
