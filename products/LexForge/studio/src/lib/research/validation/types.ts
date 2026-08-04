import { CategoryBlueprint, GenerationRule } from "../blueprint/types";

export type ValidationSeverity = "info" | "warning" | "error" | "critical";
export type ValidationCategory = "structure" | "logic" | "evidence" | "statistics" | "determinism" | "completeness" | "readiness" | "confidence" | "conflict";

export interface ValidationFinding {
  id: string;
  ruleId: string;
  category: ValidationCategory;
  severity: ValidationSeverity;
  message: string;
  affectedRules: GenerationRule[];
  metadata?: Record<string, any>;
}

export interface QualityMetrics {
  completeness: number;
  consistency: number;
  evidenceIntegrity: number;
  ruleDensity: number;
  conflictScore: number;
  confidenceReliability: number;
  coverageScore: number;
  traceabilityScore: number;
  determinismScore: number;
  generationReadiness: number;
}

export interface ValidationReport {
  category: ValidationCategory;
  passed: boolean;
  score: number;
  findings: ValidationFinding[];
}

export interface ValidatedBlueprint {
  blueprint: CategoryBlueprint;
  status: "passed" | "passed_with_warnings" | "failed";
  reports: Record<ValidationCategory, ValidationReport>;
  qualityMetrics: QualityMetrics;
  conflicts: ValidationFinding[];
  warnings: ValidationFinding[];
  recommendations: string[];
  generationReadinessScore: number;
  confidence: number;
  validatedAt: string;
  metadata: Record<string, any>;
}

export interface ValidationRule {
  id: string;
  name: string;
  category: ValidationCategory;
  validate(blueprint: CategoryBlueprint): ValidationFinding[];
}
