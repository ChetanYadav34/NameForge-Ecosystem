import { CategoryDNA } from "../../dna/types";
import { CategorySignature, ClassificationStrategy } from "../types";
import { intelligenceAnalyzerRegistry } from "../registry";
import { DefaultClassificationStrategy } from "./strategy";
import { CategorySignatureBuilder } from "./builder";

export class PatternIntelligenceEngine {
  constructor(
    private defaultStrategy: ClassificationStrategy = new DefaultClassificationStrategy()
  ) {}

  build(dna: CategoryDNA, strategy?: ClassificationStrategy): CategorySignature {
    const activeStrategy = strategy || this.defaultStrategy;
    const analyzers = intelligenceAnalyzerRegistry.getAll();
    
    const builder = new CategorySignatureBuilder(analyzers, activeStrategy);

    const signature: CategorySignature = {
      seed: dna.seed,
      sourceDnaVersion: dna.generatedAt,
      classifiedPatterns: {
        orthographic: builder.buildSignaturePatternArray(dna.orthographic.letterFrequencies.concat(
          dna.orthographic.characterNGrams,
          dna.orthographic.prefixes,
          dna.orthographic.suffixes,
          dna.orthographic.infixes,
          dna.orthographic.beginningClusters,
          dna.orthographic.endingClusters
        ), dna),
        phonetic: builder.buildSignaturePatternArray(dna.phonetic.ipaInventory.concat(
          dna.phonetic.phonemeFrequencies,
          dna.phonetic.onsetClusters,
          dna.phonetic.codaClusters,
          dna.phonetic.stressPatterns,
          dna.phonetic.syllableStructures
        ), dna),
        morphological: builder.buildSignaturePatternArray(dna.morphological.roots.concat(
          dna.morphological.stems,
          dna.morphological.affixes,
          dna.morphological.productiveMorphology,
          dna.morphological.stemFamilies
        ), dna),
        structural: builder.buildSignaturePatternArray(dna.structural.wordLengths.concat(
          dna.structural.syllableCounts,
          dna.structural.cvStructures,
          dna.structural.consonantVowelDistributions
        ), dna),
        frequency: builder.buildSignaturePatternArray(dna.frequency.zipfDistributions.concat(
          dna.frequency.rarityBands,
          dna.frequency.commonVsRare,
          dna.frequency.statisticalDistributions
        ), dna),
        semantic: builder.buildSignaturePatternArray(dna.semantic.posDistributions.concat(
          dna.semantic.taxonomyDistributions,
          dna.semantic.relationshipDistributions,
          dna.semantic.lexicalClassRatios
        ), dna),
        transition: builder.buildSignaturePatternArray(dna.transition.letterTransitions.concat(
          dna.transition.phonemeTransitions,
          dna.transition.onsetTransitions,
          dna.transition.codaTransitions
        ), dna)
      },
      generatedAt: new Date().toISOString(),
      metadata: {
        strategy: activeStrategy.id
      }
    };

    return Object.freeze(signature);
  }
}

export const patternIntelligenceEngine = new PatternIntelligenceEngine();
