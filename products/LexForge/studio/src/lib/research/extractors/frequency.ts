import { FeatureExtractor, FrequencyProfile, VocabularyGraph } from "../types";

export class FrequencyExtractor implements FeatureExtractor<FrequencyProfile> {
  id = "extractor:frequency";
  name = "Frequency Profile Extractor";

  extract(graph: VocabularyGraph): FrequencyProfile {
    const zipfs: number[] = [];
    const distribution: Record<string, number> = {};

    const entries = graph.getEntries();

    for (const entry of entries) {
      if (entry.frequency && entry.frequency.zipf) {
        zipfs.push(entry.frequency.zipf);
        
        const band = entry.frequency.band || "unknown";
        distribution[band] = (distribution[band] || 0) + 1;
      }
    }

    let averageZipf = 0;
    let medianZipf = 0;

    if (zipfs.length > 0) {
      zipfs.sort((a, b) => a - b);
      averageZipf = zipfs.reduce((sum, val) => sum + val, 0) / zipfs.length;
      medianZipf = zipfs[Math.floor(zipfs.length / 2)];
    }

    return {
      averageZipf,
      medianZipf,
      distribution
    };
  }
}
