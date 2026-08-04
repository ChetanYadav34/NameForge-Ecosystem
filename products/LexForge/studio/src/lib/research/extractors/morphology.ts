import { FeatureExtractor, MorphologyProfile, VocabularyGraph } from "../types";

export class MorphologyExtractor implements FeatureExtractor<MorphologyProfile> {
  id = "extractor:morphology";
  name = "Morphology Profile Extractor";

  extract(graph: VocabularyGraph): MorphologyProfile {
    const rootMap: Record<string, number> = {};

    const entries = graph.getEntries();

    for (const entry of entries) {
      if (entry.lemma) {
        rootMap[entry.lemma] = (rootMap[entry.lemma] || 0) + 1;
      } else if (entry.stem) {
        rootMap[entry.stem] = (rootMap[entry.stem] || 0) + 1;
      }
    }

    const morphologicalRoots = Object.entries(rootMap)
      .map(([root, frequency]) => ({ root, frequency }))
      .sort((a, b) => b.frequency - a.frequency);

    return {
      morphologicalRoots,
      commonPrefixes: [], // Placeholder for future affix parsing logic
      commonSuffixes: [], // Placeholder for future affix parsing logic
      commonInfixes: []   // Placeholder for future affix parsing logic
    };
  }
}
