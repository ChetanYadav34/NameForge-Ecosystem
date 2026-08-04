import { DiscoveryProvider, EvidenceRecord } from "../types";
import { DatasetRepository } from "@/lib/dataset/repository";

export class WordNetDiscoveryProvider implements DiscoveryProvider {
  id = "provider:wordnet";
  name = "WordNet Discovery Provider";
  version = "1.0.0";
  priority = 100;

  async discover(seed: string): Promise<EvidenceRecord[]> {
    const evidence: EvidenceRecord[] = [];
    
    // Fetch the concept from the dataset directly
    const entry = await DatasetRepository.findWord(seed);
    
    if (!entry) {
      return evidence;
    }

    const timestamp = new Date().toISOString();

    // 1. Synonyms
    if (entry.synonyms) {
      for (const synonym of entry.synonyms) {
        if (synonym.toLowerCase() !== seed.toLowerCase()) {
          evidence.push({
            id: crypto.randomUUID(),
            provider: this.id,
            providerVersion: this.version,
            source: "WordNet Dataset",
            relation: "synonym",
            strength: 1.0,
            confidence: 0.9,
            discoveredFrom: seed,
            distanceFromSeed: 1,
            timestamp,
            metadata: { target: synonym }
          });
        }
      }
    }

    // 2. Hypernyms (broader terms)
    if (entry.hypernyms) {
      for (const hypernym of entry.hypernyms) {
        if (hypernym.toLowerCase() !== seed.toLowerCase()) {
          evidence.push({
            id: crypto.randomUUID(),
            provider: this.id,
            providerVersion: this.version,
            source: "WordNet Dataset",
            relation: "hypernym",
            strength: 0.8,
            confidence: 0.85,
            discoveredFrom: seed,
            distanceFromSeed: 1,
            timestamp,
            metadata: { target: hypernym }
          });
        }
      }
    }

    // 3. Hyponyms (narrower terms)
    if (entry.hyponyms) {
      for (const hyponym of entry.hyponyms) {
        if (hyponym.toLowerCase() !== seed.toLowerCase()) {
          evidence.push({
            id: crypto.randomUUID(),
            provider: this.id,
            providerVersion: this.version,
            source: "WordNet Dataset",
            relation: "hyponym",
            strength: 0.8,
            confidence: 0.85,
            discoveredFrom: seed,
            distanceFromSeed: 1,
            timestamp,
            metadata: { target: hyponym }
          });
        }
      }
    }

    return evidence;
  }
}
