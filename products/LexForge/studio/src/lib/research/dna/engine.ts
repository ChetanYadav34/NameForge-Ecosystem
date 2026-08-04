import { CategoryKnowledge } from "../types";
import { CategoryDNA, OrthographicDNA, PhoneticDNA, MorphologicalDNA, StructuralDNA, FrequencyDNA, SemanticDNA, TransitionDNA } from "./types";
import { dnaAnalyzerRegistry } from "./registry";

export class CategoryDNAEngine {
  /**
   * Consumes a CategoryKnowledge object and executes all registered DNA Analyzers
   * to produce an immutable CategoryDNA object.
   * 
   * @param knowledge The knowledge artifact from the Discovery engine
   * @returns An immutable CategoryDNA artifact
   */
  build(knowledge: CategoryKnowledge): CategoryDNA {
    if (!knowledge.acceptedVocabulary || knowledge.acceptedVocabulary.length === 0) {
      throw new Error("CategoryDNAEngine requires a CategoryKnowledge object with acceptedVocabulary.");
    }

    const analyzers = dnaAnalyzerRegistry.getAll();
    const fragments: Record<string, any> = {};

    for (const analyzer of analyzers) {
      fragments[analyzer.id] = analyzer.analyze(knowledge);
    }

    const dna: CategoryDNA = {
      seed: knowledge.seed,
      sourceKnowledgeVersion: knowledge.version,
      // We safely assert these types because we know the specific analyzer IDs
      // but in a fully decoupled system we'd look them up by ID.
      orthographic: fragments["dna:analyzer:orthographic"] as OrthographicDNA,
      phonetic: fragments["dna:analyzer:phonetic"] as PhoneticDNA,
      morphological: fragments["dna:analyzer:morphological"] as MorphologicalDNA,
      structural: fragments["dna:analyzer:structural"] as StructuralDNA,
      frequency: fragments["dna:analyzer:frequency"] as FrequencyDNA,
      semantic: fragments["dna:analyzer:semantic"] as SemanticDNA,
      transition: fragments["dna:analyzer:transition"] as TransitionDNA,
      generatedAt: new Date().toISOString(),
      metadata: {}
    };

    // Make the DNA object strictly immutable
    return Object.freeze(dna);
  }
}

export const categoryDNAEngine = new CategoryDNAEngine();
