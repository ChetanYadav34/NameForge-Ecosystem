import { DNAAnalyzer, StructuralDNA } from "../types";
import { CategoryKnowledge } from "../../types";
import { PatternBuilder } from "../utils/pattern";

export class StructuralAnalyzer implements DNAAnalyzer<StructuralDNA> {
  id = "dna:analyzer:structural";
  name = "Structural Analyzer";

  analyze(knowledge: CategoryKnowledge): StructuralDNA {
    const vocabSize = knowledge.acceptedVocabulary.length;
    
    const wordLengths = new PatternBuilder();
    const syllableCounts = new PatternBuilder();
    const cvStructures = new PatternBuilder();
    const consonantVowelDistributions = new PatternBuilder();

    for (const candidate of knowledge.acceptedVocabulary) {
      const entry = candidate.lexEntry;
      if (!entry) continue;

      // Word length
      wordLengths.addOccurrence(candidate.term.length, candidate.term);
      
      // Syllable count
      if (entry.syllables) {
        syllableCounts.addOccurrence(entry.syllables.length, candidate.term);
      } else if (entry.phonemes) {
        // Fallback approximation if no explicit syllable split
        syllableCounts.addOccurrence(entry.vowels.length || 1, candidate.term);
      }

      // CV Structure
      // E.g., mapping letters or phonemes to C/V
      let cv = "";
      const vowels = new Set(['a','e','i','o','u','y']);
      for (const char of candidate.term.toLowerCase()) {
        if (/[a-z]/.test(char)) {
          cv += vowels.has(char) ? "V" : "C";
        }
      }
      if (cv.length > 0) {
        cvStructures.addOccurrence(cv, candidate.term);
      }

      // Consonant / Vowel Distribution (Ratio)
      const vCount = entry.vowelCount || (cv.match(/V/g) || []).length;
      const cCount = entry.consonantCount || (cv.match(/C/g) || []).length;
      
      // E.g. 2V:3C
      const ratio = `${vCount}V:${cCount}C`;
      consonantVowelDistributions.addOccurrence(ratio, candidate.term);
    }

    return {
      wordLengths: wordLengths.build(vocabSize),
      syllableCounts: syllableCounts.build(vocabSize),
      cvStructures: cvStructures.build(vocabSize),
      consonantVowelDistributions: consonantVowelDistributions.build(vocabSize)
    };
  }
}
