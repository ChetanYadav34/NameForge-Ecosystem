import { CategoryDNA, Pattern } from "../../dna/types";
import { 
  SignaturePattern, 
  PatternAssessment, 
  IntelligenceAnalyzer, 
  ClassificationStrategy 
} from "../types";
import { ScoreAggregator } from "./aggregator";
import { ScoreNormalizer } from "./normalizer";
import { ExplanationBuilder } from "./explanation";

export class CategorySignatureBuilder {
  private aggregator = new ScoreAggregator();
  private normalizer = new ScoreNormalizer();
  private explanationBuilder = new ExplanationBuilder();

  constructor(
    private analyzers: IntelligenceAnalyzer[],
    private strategy: ClassificationStrategy
  ) {}

  buildSignaturePattern(pattern: Pattern, context: CategoryDNA): SignaturePattern {
    // 1. Collect Assessments
    const assessments: PatternAssessment[] = [];
    for (const analyzer of this.analyzers) {
      const assessment = analyzer.analyze(pattern, context);
      assessments.push(assessment);
    }

    // 2. Aggregate Scores
    const rawScores = this.aggregator.aggregate(assessments);

    // 3. Normalize Scores
    const normalizedScores = this.normalizer.normalize(rawScores);

    // 4. Classify
    const classification = this.strategy.classify(normalizedScores);

    // 5. Build Explanation
    const explanation = this.explanationBuilder.build(assessments);
    const evidenceSummary = this.explanationBuilder.buildEvidenceSummary(assessments);

    return {
      originalPattern: pattern,
      assessments,
      aggregatedScores: rawScores,
      normalizedScores,
      classification,
      explanation,
      supportingWords: pattern.supportingWords,
      evidenceSummary
    };
  }

  buildSignaturePatternArray(patterns: Pattern[], context: CategoryDNA): SignaturePattern[] {
    return patterns.map(p => this.buildSignaturePattern(p, context));
  }
}
