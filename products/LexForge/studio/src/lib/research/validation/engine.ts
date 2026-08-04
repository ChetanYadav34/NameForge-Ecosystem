import { CategoryBlueprint } from "../blueprint/types";
import { ValidatedBlueprint, ValidationFinding } from "./types";
import { validationRegistry } from "./registry";
import { ValidationAggregator, QualityMetricsBuilder, ValidationReportBuilder } from "./builders";

export class ValidationEngine {
  private aggregator = new ValidationAggregator();
  private metricsBuilder = new QualityMetricsBuilder();
  private reportBuilder = new ValidationReportBuilder();

  validate(blueprint: CategoryBlueprint): ValidatedBlueprint {
    const rules = validationRegistry.getAll();
    const allFindings: ValidationFinding[] = [];

    // 1. Run all independent validators
    for (const rule of rules) {
      allFindings.push(...rule.validate(blueprint));
    }

    // 2. Aggregate findings
    const groupedFindings = this.aggregator.aggregate(allFindings);

    // 3. Calculate metrics
    const qualityMetrics = this.metricsBuilder.build(groupedFindings);

    // 4. Build reports
    const reports = this.reportBuilder.buildReports(groupedFindings, qualityMetrics);

    // 5. Determine overall status
    const hasCritical = allFindings.some(f => f.severity === "critical");
    const hasErrors = allFindings.some(f => f.severity === "error");
    const hasWarnings = allFindings.some(f => f.severity === "warning");

    let status: "passed" | "passed_with_warnings" | "failed" = "passed";
    if (hasCritical || hasErrors) {
      status = "failed";
    } else if (hasWarnings) {
      status = "passed_with_warnings";
    }

    // 6. Filter direct conflicts and warnings
    const conflicts = allFindings.filter(f => f.category === "conflict");
    const warnings = allFindings.filter(f => f.severity === "warning");

    const recommendations = allFindings
      .filter(f => f.severity === "info")
      .map(f => f.message);

    const validatedBlueprint: ValidatedBlueprint = {
      blueprint,
      status,
      reports,
      qualityMetrics,
      conflicts,
      warnings,
      recommendations,
      generationReadinessScore: qualityMetrics.generationReadiness,
      confidence: qualityMetrics.confidenceReliability,
      validatedAt: new Date().toISOString(),
      metadata: {}
    };

    return Object.freeze(validatedBlueprint);
  }
}

export const validationEngine = new ValidationEngine();
