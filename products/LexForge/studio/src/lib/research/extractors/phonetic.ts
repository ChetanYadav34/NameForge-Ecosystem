import { FeatureExtractor, PhoneticProfile, VocabularyGraph } from "../types";

export class PhoneticExtractor implements FeatureExtractor<PhoneticProfile> {
  id = "extractor:phonetic";
  name = "Phonetic Profile Extractor";

  extract(graph: VocabularyGraph): PhoneticProfile {
    const phonemeInventory: Record<string, number> = {};
    const syllableInventory: Record<string, number> = {};
    const onsetClusters: Record<string, number> = {};
    const codaClusters: Record<string, number> = {};
    const soundTransitionFrequencies: Record<string, number> = {};

    const entries = graph.getEntries();

    for (const entry of entries) {
      // 1. Phonemes
      if (entry.phonemes) {
        for (const phoneme of entry.phonemes) {
          phonemeInventory[phoneme] = (phonemeInventory[phoneme] || 0) + 1;
        }

        // Sound transitions (bigrams)
        for (let i = 0; i < entry.phonemes.length - 1; i++) {
          const transition = `${entry.phonemes[i]}->${entry.phonemes[i+1]}`;
          soundTransitionFrequencies[transition] = (soundTransitionFrequencies[transition] || 0) + 1;
        }

        // Approximate onset/coda from phonemes if needed, 
        // normally we would parse syllables, but this is a placeholder metric extraction based on the available data.
        if (entry.phonemes.length > 0) {
          const firstSound = entry.phonemes[0];
          const lastSound = entry.phonemes[entry.phonemes.length - 1];
          onsetClusters[firstSound] = (onsetClusters[firstSound] || 0) + 1;
          codaClusters[lastSound] = (codaClusters[lastSound] || 0) + 1;
        }
      }

      // 2. Syllables
      if (entry.syllables) {
        for (const syllable of entry.syllables) {
          syllableInventory[syllable] = (syllableInventory[syllable] || 0) + 1;
        }
      }
    }

    return {
      phonemeInventory,
      syllableInventory,
      onsetClusters,
      codaClusters,
      soundTransitionFrequencies
    };
  }
}
