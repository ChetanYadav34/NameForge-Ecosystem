import { Pattern } from "../types";

/**
 * Helper to build patterns during analysis.
 */
export class PatternBuilder {
  private patterns: Map<string, Pattern> = new Map();

  addOccurrence(value: string | number, supportingWord: string, metadata: Record<string, any> = {}) {
    const key = String(value);
    
    if (!this.patterns.has(key)) {
      this.patterns.set(key, {
        id: crypto.randomUUID(),
        value,
        frequency: 0,
        coverage: 0,
        confidence: 1.0, // base
        supportingWords: [],
        evidenceCount: 0,
        metadata
      });
    }

    const pattern = this.patterns.get(key)!;
    pattern.frequency++;
    
    // Add unique supporting words
    if (!pattern.supportingWords.includes(supportingWord)) {
      pattern.supportingWords.push(supportingWord);
    }
    
    pattern.evidenceCount++;
    
    // Merge new metadata fields if they don't exist
    for (const [k, v] of Object.entries(metadata)) {
      if (pattern.metadata[k] === undefined) {
        pattern.metadata[k] = v;
      }
    }
  }

  /**
   * Finalizes patterns by calculating coverage against a total vocabulary size,
   * then sorting by frequency descending.
   */
  build(totalVocabSize: number): Pattern[] {
    const result = Array.from(this.patterns.values());
    
    for (const pattern of result) {
      if (totalVocabSize > 0) {
        // Coverage is the percentage of unique words that exhibit this pattern.
        pattern.coverage = pattern.supportingWords.length / totalVocabSize;
      } else {
        pattern.coverage = 0;
      }
    }

    // Sort by frequency descending, then by value length (shorter first), then alphabetical
    result.sort((a, b) => {
      if (b.frequency !== a.frequency) {
        return b.frequency - a.frequency;
      }
      const aVal = String(a.value);
      const bVal = String(b.value);
      if (aVal.length !== bVal.length) {
        return aVal.length - bVal.length;
      }
      return aVal.localeCompare(bVal);
    });

    return result;
  }
}
