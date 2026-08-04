import { DiscoveryProvider, EvidenceRecord } from "../types";
import { DatasetRepository } from "@/lib/dataset/repository";

// A basic stopword list to filter out meaningless words from definitions
const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", 
  "into", "is", "it", "no", "not", "of", "on", "or", "such", "that", "the", 
  "their", "then", "there", "these", "they", "this", "to", "was", "will", "with",
  "which", "who", "whom", "whose", "why", "how", "when", "where", "what", "we",
  "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "it", "its",
  "they", "them", "their", "theirs", "any", "all", "some", "many", "much", "more",
  "most", "other", "another", "such", "own", "same", "so", "than", "too", "very",
  "can", "could", "may", "might", "must", "shall", "should", "would", "do", "does",
  "did", "doing", "have", "has", "had", "having", "am", "are", "is", "was", "were",
  "be", "been", "being"
]);

export class DefinitionDiscoveryProvider implements DiscoveryProvider {
  id = "provider:definition";
  name = "Definition Discovery Provider";
  version = "1.0.0";
  priority = 110;

  async discover(seed: string): Promise<EvidenceRecord[]> {
    const evidence: EvidenceRecord[] = [];
    
    // Fetch the concept from the dataset directly
    const entry = await DatasetRepository.findWord(seed);
    
    if (!entry || !entry.definitions) {
      return evidence;
    }

    const timestamp = new Date().toISOString();

    for (const def of entry.definitions) {
      // Basic tokenization: split by non-word characters and filter
      const words = def.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2);
      
      const uniqueWords = new Set<string>();

      for (const word of words) {
        if (!STOPWORDS.has(word) && word !== seed.toLowerCase()) {
          uniqueWords.add(word);
        }
      }

      for (const word of uniqueWords) {
        // We do NOT recursively resolve definitions here as per requirement
        evidence.push({
          id: crypto.randomUUID(),
          provider: this.id,
          providerVersion: this.version,
          source: "Dataset Definition",
          relation: "appears-in-definition",
          strength: 0.6, // Lower strength than a direct synonym
          confidence: 0.7,
          discoveredFrom: seed,
          distanceFromSeed: 1,
          timestamp,
          metadata: { target: word, originalDefinition: def }
        });
      }
    }

    return evidence;
  }
}
