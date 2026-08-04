import { ResearchContext, ResearchPass } from "../types";
import { PhoneticExtractor } from "../extractors/phonetic";
import { MorphologyExtractor } from "../extractors/morphology";
import { OrthographyExtractor } from "../extractors/orthography";
import { FrequencyExtractor } from "../extractors/frequency";
import { SemanticExtractor } from "../extractors/semantics";

export class FeatureExtractionPass implements ResearchPass {
  id = "pass:feature-extraction";
  name = "Feature Extraction Pass";
  priority = 400;

  async execute(context: ResearchContext): Promise<void> {
    const startTime = performance.now();
    if (!context.graph) {
      throw new Error("FeatureExtractionPass: Missing VocabularyGraph. Run GraphConstructionPass first.");
    }

    const phoneticExtractor = new PhoneticExtractor();
    const morphologyExtractor = new MorphologyExtractor();
    const orthographyExtractor = new OrthographyExtractor();
    const frequencyExtractor = new FrequencyExtractor();
    const semanticExtractor = new SemanticExtractor();

    context.profiles = {
      phonetics: phoneticExtractor.extract(context.graph),
      morphology: morphologyExtractor.extract(context.graph),
      orthography: orthographyExtractor.extract(context.graph),
      frequency: frequencyExtractor.extract(context.graph),
      semantics: semanticExtractor.extract(context.graph),
    };

    const duration = performance.now() - startTime;
    context.session.executionMetrics[this.id] = {
      durationMs: duration,
      extractorsRun: 5
    };
  }
}
