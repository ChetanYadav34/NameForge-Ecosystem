import { ValidationFinding, ValidationCategory } from "../types";

export class ValidationAggregator {
  aggregate(findings: ValidationFinding[]): Record<ValidationCategory, ValidationFinding[]> {
    const grouped: Record<ValidationCategory, ValidationFinding[]> = {
      structure: [],
      logic: [],
      evidence: [],
      statistics: [],
      determinism: [],
      completeness: [],
      readiness: [],
      confidence: [],
      conflict: []
    };

    for (const finding of findings) {
      if (grouped[finding.category]) {
        grouped[finding.category].push(finding);
      }
    }

    return grouped;
  }
}
