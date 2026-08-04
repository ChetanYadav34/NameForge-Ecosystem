import { DNAAnalyzer, MorphologicalDNA } from "../types";
import { CategoryKnowledge } from "../../types";
import { PatternBuilder } from "../utils/pattern";

export class MorphologicalAnalyzer implements DNAAnalyzer<MorphologicalDNA> {
  id = "dna:analyzer:morphological";
  name = "Morphological Analyzer";

  analyze(knowledge: CategoryKnowledge): MorphologicalDNA {
    const vocabSize = knowledge.acceptedVocabulary.length;
    
    const roots = new PatternBuilder();
    const stems = new PatternBuilder();
    const affixes = new PatternBuilder();
    const productiveMorphology = new PatternBuilder();
    const stemFamilies = new PatternBuilder();

    for (const candidate of knowledge.acceptedVocabulary) {
      const entry = candidate.lexEntry;
      if (!entry) continue;

      if (entry.lemma) {
        roots.addOccurrence(entry.lemma, candidate.term);
      }
      if (entry.stem) {
        stems.addOccurrence(entry.stem, candidate.term);
      }
      if (entry.familyId) {
        stemFamilies.addOccurrence(entry.familyId, candidate.term);
      }

      // Simple affix approximation using derivations if available
      if (entry.derivations && entry.derivations.length > 0) {
        for (const deriv of entry.derivations) {
          // If the derivation starts with the stem, it's a suffix, etc.
          // For now, we just track the derivation form as productive morphology
          productiveMorphology.addOccurrence(deriv, candidate.term);
        }
      }
    }

    return {
      roots: roots.build(vocabSize),
      stems: stems.build(vocabSize),
      affixes: affixes.build(vocabSize),
      productiveMorphology: productiveMorphology.build(vocabSize),
      stemFamilies: stemFamilies.build(vocabSize)
    };
  }
}
