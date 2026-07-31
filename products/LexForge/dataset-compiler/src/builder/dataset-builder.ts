// ============================================================================
// LexForge Dataset Compiler — Dataset Builder
// ============================================================================
// Transforms validated TransformedWord records into the final LexEntry schema.
//
// Version 2 populates:
//   id, word, lemma, arpabet, alternatePronunciations, ipa, length
//
// Future-version fields are initialized as empty:
//   phonemes, syllables, categories
// ============================================================================

import { FinalWord, LexEntry, PipelineModule, PipelineModuleMetadata } from "../types/index.js";
import { logger } from "../utils/logger.js";

/**
 * Build the final dataset from validated phonology records.
 *
 * Each record is assigned a sequential ID starting at 1.
 *
 * @param records - Validated records.
 * @returns Array of complete LexEntry objects ready for export.
 */
export class DatasetBuilder implements PipelineModule {
  private nextId = 1;

  readonly metadata: PipelineModuleMetadata = {
    id: "builder.dataset",
    name: "Dataset Builder",
    version: "1.0.0",
    stage: "build",
    priority: 100,
    requiresModules: ["engine.word_family"],
    requiresFeatures: [
      "feature.lemma", 
      "feature.stem", 
      "feature.inflections", 
      "feature.derivations",
      "feature.familyId",
      "feature.headword",
      "feature.wordFamily",
      "feature.familySize",
      "feature.familyConfidence",
      "feature.frequency"
    ],
    producesFeatures: [],
    author: "LexForge",
  };

  build(records: FinalWord[]): LexEntry[] {
    logger.info("Building final dataset...");

    const entries: LexEntry[] = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      entries.push({
        id: this.nextId++,
        word: record.word,
        lemma: record.lemma,
        stem: record.stem,
        inflections: record.inflections,
        derivations: record.derivations,
        familyId: record.familyId,
        headword: record.headword,
        wordFamily: record.wordFamily,
        familySize: record.familySize,
        familyConfidence: record.familyConfidence,
        frequency: record.frequency,
        arpabet: record.arpabet,
        alternatePronunciations: record.alternatePronunciations,
        ipa: record.ipa,
        phonemes: record.phonemes,
        vowels: record.vowels,
        consonants: record.consonants,
        stressPattern: record.stressPattern,
        phonemeCount: record.phonemeCount,
        vowelCount: record.vowelCount,
        consonantCount: record.consonantCount,
        syllables: [],       // Future version
        categories: [],      // Future version
        length: record.word.length,
        partOfSpeech: record.partOfSpeech,
        definitions: record.definitions,
        synonyms: record.synonyms,
        antonyms: record.antonyms,
        hypernyms: record.hypernyms,
        hyponyms: record.hyponyms,
        domains: record.domains,
        sources: record.sources,
      });
    }

    logger.success(`Built ${entries.length.toLocaleString()} dataset entries`);

    return entries;
  }
}
