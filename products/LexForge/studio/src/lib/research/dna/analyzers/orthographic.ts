import { DNAAnalyzer, OrthographicDNA } from "../types";
import { CategoryKnowledge } from "../../types";
import { PatternBuilder } from "../utils/pattern";

export class OrthographicAnalyzer implements DNAAnalyzer<OrthographicDNA> {
  id = "dna:analyzer:orthographic";
  name = "Orthographic Analyzer";

  analyze(knowledge: CategoryKnowledge): OrthographicDNA {
    const vocabSize = knowledge.acceptedVocabulary.length;
    
    const letterFrequencies = new PatternBuilder();
    const characterNGrams = new PatternBuilder();
    const prefixes = new PatternBuilder();
    const suffixes = new PatternBuilder();
    const infixes = new PatternBuilder();
    const beginningClusters = new PatternBuilder();
    const endingClusters = new PatternBuilder();

    // Configuration for n-grams (e.g., bigrams and trigrams)
    const nGramSizes = [2, 3];

    for (const candidate of knowledge.acceptedVocabulary) {
      const word = candidate.term.toLowerCase();
      
      // Letter frequencies
      for (const char of word) {
        letterFrequencies.addOccurrence(char, word);
      }

      // Character n-grams
      for (const n of nGramSizes) {
        if (word.length >= n) {
          for (let i = 0; i <= word.length - n; i++) {
            const ngram = word.substring(i, i + n);
            characterNGrams.addOccurrence(ngram, word, { size: n });
          }
        }
      }

      // Prefixes & Beginning Clusters
      // Simple approximation: check prefixes of length 2 and 3
      if (word.length >= 4) {
        const p2 = word.substring(0, 2);
        prefixes.addOccurrence(p2, word, { length: 2 });
        beginningClusters.addOccurrence(p2, word);
        
        const p3 = word.substring(0, 3);
        prefixes.addOccurrence(p3, word, { length: 3 });
        beginningClusters.addOccurrence(p3, word);
      }

      // Suffixes & Ending Clusters
      if (word.length >= 4) {
        const s2 = word.substring(word.length - 2);
        suffixes.addOccurrence(s2, word, { length: 2 });
        endingClusters.addOccurrence(s2, word);
        
        const s3 = word.substring(word.length - 3);
        suffixes.addOccurrence(s3, word, { length: 3 });
        endingClusters.addOccurrence(s3, word);
      }

      // Infixes (simplified: anything between first 2 and last 2 letters of long words)
      if (word.length >= 6) {
        const infix = word.substring(2, word.length - 2);
        infixes.addOccurrence(infix, word);
      }
    }

    return {
      letterFrequencies: letterFrequencies.build(vocabSize),
      characterNGrams: characterNGrams.build(vocabSize),
      prefixes: prefixes.build(vocabSize),
      suffixes: suffixes.build(vocabSize),
      infixes: infixes.build(vocabSize),
      beginningClusters: beginningClusters.build(vocabSize),
      endingClusters: endingClusters.build(vocabSize)
    };
  }
}
