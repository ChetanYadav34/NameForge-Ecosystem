import { Candidate, EvaluationAnalyzer, EvaluationContext, EvaluationMetric } from "../types";

export class BlueprintComplianceAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:blueprint_compliance";
  name = "Blueprint Compliance Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 1.0
    };
  }
}

export class NoveltyAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:novelty";
  name = "Novelty Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 0.75
    };
  }
}

export class ConstructionIntegrityAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:construction_integrity";
  name = "Construction Integrity Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 1.0
    };
  }
}

export class TraceabilityAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:traceability";
  name = "Traceability Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    // Check if every fragment has an instruction
    const hasTrace = candidate.fragments.every(f => f.instruction !== undefined);
    return {
      analyzerId: this.id,
      name: this.name,
      score: hasTrace ? 1.0 : 0.0
    };
  }
}
