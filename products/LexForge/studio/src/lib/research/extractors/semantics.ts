import { FeatureExtractor, SemanticProfile, VocabularyGraph } from "../types";

export class SemanticExtractor implements FeatureExtractor<SemanticProfile> {
  id = "extractor:semantics";
  name = "Semantic Profile Extractor";

  extract(graph: VocabularyGraph): SemanticProfile {
    const taxonomyDistribution: Record<string, number> = {};
    const hypernymMap: Record<string, number> = {};

    const entries = graph.getEntries();

    for (const entry of entries) {
      // 1. Taxonomy Distribution (Parts of Speech)
      if (entry.partOfSpeech) {
        for (const pos of entry.partOfSpeech) {
          taxonomyDistribution[pos] = (taxonomyDistribution[pos] || 0) + 1;
        }
      }

      // 2. Common Hypernyms
      if (entry.hypernyms) {
        for (const hypernym of entry.hypernyms) {
          hypernymMap[hypernym] = (hypernymMap[hypernym] || 0) + 1;
        }
      }
    }

    const commonHypernyms = Object.entries(hypernymMap)
      .map(([term, frequency]) => ({ term, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 50); // Keep top 50

    return {
      taxonomyDistribution,
      commonHypernyms
    };
  }
}
