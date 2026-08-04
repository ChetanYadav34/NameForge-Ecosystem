import { DNAAnalyzer, SemanticDNA } from "../types";
import { CategoryKnowledge } from "../../types";
import { PatternBuilder } from "../utils/pattern";

export class SemanticAnalyzer implements DNAAnalyzer<SemanticDNA> {
  id = "dna:analyzer:semantic";
  name = "Semantic Analyzer";

  analyze(knowledge: CategoryKnowledge): SemanticDNA {
    const vocabSize = knowledge.acceptedVocabulary.length;
    
    const posDistributions = new PatternBuilder();
    const taxonomyDistributions = new PatternBuilder();
    const relationshipDistributions = new PatternBuilder();
    const lexicalClassRatios = new PatternBuilder();

    let nounCount = 0;
    let verbCount = 0;
    let adjCount = 0;

    for (const candidate of knowledge.acceptedVocabulary) {
      const entry = candidate.lexEntry;
      if (!entry) continue;

      // Part of Speech
      if (entry.partOfSpeech) {
        for (const pos of entry.partOfSpeech) {
          posDistributions.addOccurrence(pos, candidate.term);
          if (pos === "noun") nounCount++;
          if (pos === "verb") verbCount++;
          if (pos === "adjective") adjCount++;
        }
      }

      // Taxonomy / Domains
      if (entry.domains) {
        for (const domain of entry.domains) {
          taxonomyDistributions.addOccurrence(domain, candidate.term);
        }
      } else if (entry.hypernyms) {
        // Fallback taxonomy approximation
        for (const hyper of entry.hypernyms) {
          taxonomyDistributions.addOccurrence(hyper, candidate.term);
        }
      }

      // Relationship Distributions based on how it was discovered
      for (const ev of candidate.evidence) {
        relationshipDistributions.addOccurrence(ev.relation, candidate.term);
      }
    }
    
    // Lexical Class Ratios
    lexicalClassRatios.addOccurrence("Nouns", "aggregate", { count: nounCount });
    lexicalClassRatios.addOccurrence("Verbs", "aggregate", { count: verbCount });
    lexicalClassRatios.addOccurrence("Adjectives", "aggregate", { count: adjCount });

    return {
      posDistributions: posDistributions.build(vocabSize),
      taxonomyDistributions: taxonomyDistributions.build(vocabSize),
      relationshipDistributions: relationshipDistributions.build(vocabSize),
      lexicalClassRatios: lexicalClassRatios.build(vocabSize)
    };
  }
}
