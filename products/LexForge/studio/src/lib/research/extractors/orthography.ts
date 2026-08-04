import { FeatureExtractor, OrthographyProfile, VocabularyGraph } from "../types";

export class OrthographyExtractor implements FeatureExtractor<OrthographyProfile> {
  id = "extractor:orthography";
  name = "Orthography Profile Extractor";

  extract(graph: VocabularyGraph): OrthographyProfile {
    const characterNgrams: Record<string, number> = {};
    const letterFrequency: Record<string, number> = {};

    const entries = graph.getEntries();

    for (const entry of entries) {
      const word = entry.word.toLowerCase();
      
      // Letter frequency
      for (const char of word) {
        if (/[a-z]/.test(char)) {
          letterFrequency[char] = (letterFrequency[char] || 0) + 1;
        }
      }

      // Character bigrams
      for (let i = 0; i < word.length - 1; i++) {
        const bigram = word.substring(i, i + 2);
        if (/^[a-z]{2}$/.test(bigram)) {
          characterNgrams[bigram] = (characterNgrams[bigram] || 0) + 1;
        }
      }
    }

    return {
      characterNgrams,
      letterFrequency
    };
  }
}
