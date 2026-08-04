import { DNAAnalyzer, PhoneticDNA } from "../types";
import { CategoryKnowledge } from "../../types";
import { PatternBuilder } from "../utils/pattern";

export class PhoneticAnalyzer implements DNAAnalyzer<PhoneticDNA> {
  id = "dna:analyzer:phonetic";
  name = "Phonetic Analyzer";

  analyze(knowledge: CategoryKnowledge): PhoneticDNA {
    const vocabSize = knowledge.acceptedVocabulary.length;
    
    const ipaInventory = new PatternBuilder();
    const phonemeFrequencies = new PatternBuilder();
    const onsetClusters = new PatternBuilder();
    const codaClusters = new PatternBuilder();
    const stressPatterns = new PatternBuilder();
    const syllableStructures = new PatternBuilder();

    for (const candidate of knowledge.acceptedVocabulary) {
      const entry = candidate.lexEntry;
      if (!entry) continue; // Skip if no LexEntry backing this candidate

      // IPA / Phonemes
      if (entry.phonemes && entry.phonemes.length > 0) {
        for (const p of entry.phonemes) {
          ipaInventory.addOccurrence(p, candidate.term);
          phonemeFrequencies.addOccurrence(p, candidate.term);
        }
      }

      // Syllable Structures & Onset/Coda Clusters
      // Simple approximation assuming standard syllable array exists or extracting from phonemes
      if (entry.syllables) {
        for (const syl of entry.syllables) {
          syllableStructures.addOccurrence(syl, candidate.term);
          
          // Naive onset/coda extraction: 
          // Assuming CV patterns like CVC, CCV, etc. we could look at the structure, 
          // but if we just have syllable strings, we extract consonant clusters.
          const consonantsOnly = syl.replace(/[aeiouæɛɪɒʊʌəɔɑɜiːuː]/gi, '-');
          const clusters = consonantsOnly.split('-').filter(c => c.length > 0);
          
          if (clusters.length > 0) {
            // First cluster in syllable is onset
            onsetClusters.addOccurrence(clusters[0], candidate.term);
            // Last cluster in syllable is coda (if distinct from onset)
            if (clusters.length > 1) {
              codaClusters.addOccurrence(clusters[clusters.length - 1], candidate.term);
            }
          }
        }
      }

      // Stress Patterns
      if (entry.stressPattern) {
        stressPatterns.addOccurrence(entry.stressPattern, candidate.term);
      }
    }

    return {
      ipaInventory: ipaInventory.build(vocabSize),
      phonemeFrequencies: phonemeFrequencies.build(vocabSize),
      onsetClusters: onsetClusters.build(vocabSize),
      codaClusters: codaClusters.build(vocabSize),
      stressPatterns: stressPatterns.build(vocabSize),
      syllableStructures: syllableStructures.build(vocabSize)
    };
  }
}
