import { Candidate, EvaluationAnalyzer, EvaluationContext, EvaluationMetric } from "../types";

export class PronounceabilityAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:pronounceability";
  name = "Pronounceability Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 0.9, // Mock score
      details: {
        vowelConsonantRatio: 0.5
      }
    };
  }
}

export class PhoneticFlowAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:phonetic_flow";
  name = "Phonetic Flow Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 0.85
    };
  }
}

export class ReadabilityAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:readability";
  name = "Readability Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 0.95
    };
  }
}

export class MemorabilityAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:memorability";
  name = "Memorability Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 0.8
    };
  }
}
