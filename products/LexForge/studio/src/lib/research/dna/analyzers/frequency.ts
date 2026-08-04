import { DNAAnalyzer, FrequencyDNA } from "../types";
import { CategoryKnowledge } from "../../types";
import { PatternBuilder } from "../utils/pattern";

export class FrequencyAnalyzer implements DNAAnalyzer<FrequencyDNA> {
  id = "dna:analyzer:frequency";
  name = "Frequency Analyzer";

  analyze(knowledge: CategoryKnowledge): FrequencyDNA {
    const vocabSize = knowledge.acceptedVocabulary.length;
    
    const zipfDistributions = new PatternBuilder();
    const rarityBands = new PatternBuilder();
    const commonVsRare = new PatternBuilder();
    const statisticalDistributions = new PatternBuilder();

    let commonCount = 0;
    let rareCount = 0;

    for (const candidate of knowledge.acceptedVocabulary) {
      const entry = candidate.lexEntry;
      if (!entry) continue;

      if (entry.frequency) {
        const zipfFloor = Math.floor(entry.frequency.zipf);
        zipfDistributions.addOccurrence(zipfFloor, candidate.term, { exactZipf: entry.frequency.zipf });
        
        rarityBands.addOccurrence(entry.frequency.band, candidate.term);
        
        if (entry.frequency.zipf >= 4.0) {
          commonVsRare.addOccurrence("common", candidate.term);
          commonCount++;
        } else {
          commonVsRare.addOccurrence("rare", candidate.term);
          rareCount++;
        }
      } else {
        rarityBands.addOccurrence("unknown", candidate.term);
        commonVsRare.addOccurrence("unknown", candidate.term);
      }
    }
    
    // Example of a statistical distribution pattern
    const dominantBand = commonCount > rareCount ? "Mostly Common" : "Mostly Rare";
    statisticalDistributions.addOccurrence(dominantBand, "aggregate", { commonCount, rareCount });

    return {
      zipfDistributions: zipfDistributions.build(vocabSize),
      rarityBands: rarityBands.build(vocabSize),
      commonVsRare: commonVsRare.build(vocabSize),
      statisticalDistributions: statisticalDistributions.build(vocabSize)
    };
  }
}
