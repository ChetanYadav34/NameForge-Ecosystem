import { DNAAnalyzer, TransitionDNA } from "../types";
import { CategoryKnowledge } from "../../types";
import { PatternBuilder } from "../utils/pattern";

export class TransitionAnalyzer implements DNAAnalyzer<TransitionDNA> {
  id = "dna:analyzer:transition";
  name = "Transition Analyzer";

  analyze(knowledge: CategoryKnowledge): TransitionDNA {
    const vocabSize = knowledge.acceptedVocabulary.length;
    
    const letterTransitions = new PatternBuilder();
    const phonemeTransitions = new PatternBuilder();
    const onsetTransitions = new PatternBuilder();
    const codaTransitions = new PatternBuilder();

    for (const candidate of knowledge.acceptedVocabulary) {
      const word = candidate.term.toLowerCase();
      const entry = candidate.lexEntry;

      // Letter Transitions (Bigrams of consecutive letters)
      for (let i = 0; i < word.length - 1; i++) {
        const transition = `${word[i]}->${word[i+1]}`;
        letterTransitions.addOccurrence(transition, candidate.term, { from: word[i], to: word[i+1] });
      }

      if (entry) {
        // Phoneme Transitions
        if (entry.phonemes && entry.phonemes.length > 1) {
          for (let i = 0; i < entry.phonemes.length - 1; i++) {
            const transition = `${entry.phonemes[i]}->${entry.phonemes[i+1]}`;
            phonemeTransitions.addOccurrence(transition, candidate.term, { from: entry.phonemes[i], to: entry.phonemes[i+1] });
          }
        }

        // Onset and Coda Transitions (if we parse syllables)
        if (entry.syllables && entry.syllables.length > 1) {
          for (let i = 0; i < entry.syllables.length - 1; i++) {
            // Simplified onset/coda extraction per syllable
            const syl1 = entry.syllables[i].replace(/[aeiouæɛɪɒʊʌəɔɑɜiːuː]/gi, '-').split('-').filter(c => c.length > 0);
            const syl2 = entry.syllables[i+1].replace(/[aeiouæɛɪɒʊʌəɔɑɜiːuː]/gi, '-').split('-').filter(c => c.length > 0);
            
            // Coda of first to onset of second
            const coda1 = syl1.length > 1 ? syl1[syl1.length - 1] : syl1.length === 1 ? syl1[0] : "";
            const onset2 = syl2.length > 0 ? syl2[0] : "";
            
            if (coda1 && onset2) {
              const transition = `${coda1}->${onset2}`;
              codaTransitions.addOccurrence(transition, candidate.term, { from: coda1, to: onset2 });
              // Also counts as an onset transition from previous coda context
              onsetTransitions.addOccurrence(transition, candidate.term, { from: coda1, to: onset2 });
            }
          }
        }
      }
    }

    return {
      letterTransitions: letterTransitions.build(vocabSize),
      phonemeTransitions: phonemeTransitions.build(vocabSize),
      onsetTransitions: onsetTransitions.build(vocabSize),
      codaTransitions: codaTransitions.build(vocabSize)
    };
  }
}
