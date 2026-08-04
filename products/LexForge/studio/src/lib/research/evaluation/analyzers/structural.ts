import { Candidate, EvaluationAnalyzer, EvaluationContext, EvaluationMetric } from "../types";

export class StructureAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:structure";
  name = "Structure Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 1.0
    };
  }
}

export class TransitionAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:transition";
  name = "Transition Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 1.0
    };
  }
}

export class MorphologyAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:morphology";
  name = "Morphology Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 1.0
    };
  }
}

export class LengthAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:length";
  name = "Length Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 1.0
    };
  }
}

export class SyllableAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:syllable";
  name = "Syllable Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 1.0
    };
  }
}

export class ClusterAnalyzer implements EvaluationAnalyzer {
  id = "analyzer:cluster";
  name = "Cluster Analyzer";

  analyze(candidate: Candidate, context: EvaluationContext): EvaluationMetric {
    return {
      analyzerId: this.id,
      name: this.name,
      score: 1.0
    };
  }
}
