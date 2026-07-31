import { config, projectRoot } from "./config/index.js";
import { normalize } from "./normalizer/normalizer.js";
import { merge } from "./merger/merger.js";
import { validate } from "./validator/validator.js";
import { logger } from "./utils/logger.js";
import { PipelineRegistry } from "./registry/pipeline.registry.js";
import { FeatureRegistry } from "./registry/feature.registry.js";
import { ResourceRegistry } from "./registry/resource.registry.js";
import { exportDataset } from "./exporter/exporter.js";
import path from "node:path";

// Importers
import { WordsAlphaImporter } from "./importers/words-alpha.importer.js";
import { CmudictImporter } from "./importers/cmudict.importer.js";
// Transformers
import { ArpabetToIpaTransformer } from "./transformers/arpabet-to-ipa.transformer.js";
import { IpaToPhonologyTransformer } from "./transformers/ipa-to-phonology.transformer.js";
// Enrichers
import { WordNetEnricher } from "./enrichers/wordnet.enricher.js";
import { HunspellEnricher } from "./enrichers/hunspell.enricher.js";
import { FrequencyEnricher } from "./enrichers/frequency.enricher.js";
// Validation Rules
import { EmptyWordRule } from "./validator/rules/empty-word.rule.js";
import { DuplicateWordRule } from "./validator/rules/duplicate-word.rule.js";
import { NonAlphabeticRule } from "./validator/rules/non-alphabetic.rule.js";
import { ArpabetRule } from "./validator/rules/arpabet.rule.js";
import { IpaPresenceRule } from "./validator/rules/ipa-presence.rule.js";
import { PhonologyCountsRule } from "./validator/rules/phonology-counts.rule.js";
import { HasVowelRule } from "./validator/rules/has-vowel.rule.js";
import { UnknownIpaRule } from "./validator/rules/unknown-ipa.rule.js";
import { StressPatternRule } from "./validator/rules/stress-pattern.rule.js";
import { UniqueSemanticsRule } from "./validator/rules/unique-semantics.rule.js";
import { NoEmptySemanticsRule } from "./validator/rules/no-empty-semantics.rule.js";
import { MorphologyRule } from "./validator/rules/morphology.rule.js";
import { WordFamilyRule } from "./validator/rules/word-family.rule.js";
import { FrequencyRule } from "./validator/rules/frequency.rule.js";
// Engines
import { WordFamilyEngine } from "./engines/word-family.engine.js";
// Builders
import { DatasetBuilder } from "./builder/dataset-builder.js";

export class Pipeline {
  /**
   * Registers all core modules into the PipelineRegistry.
   */
  static bootstrap(): void {
    // Register Resources
    ResourceRegistry.register({
      id: "resource.words_alpha",
      name: "Words Alpha",
      version: "1.0",
      description: "Canonical list of English words",
      provider: "LexForge",
      language: "en",
      format: "txt",
      resourceType: "dictionary",
      path: config.wordsAlphaPath,
      consumedBy: ["importer.wordsAlpha"],
      provides: ["feature.word"],
    });

    ResourceRegistry.register({
      id: "resource.cmudict",
      name: "CMU Pronouncing Dictionary",
      version: "0.7b",
      description: "North American English pronunciation dictionary",
      provider: "CMU",
      language: "en-US",
      format: "txt",
      resourceType: "pronunciation",
      path: config.cmudictPath,
      consumedBy: ["importer.cmudict"],
      provides: ["feature.pronunciation"],
    });

    ResourceRegistry.register({
      id: "resource.wordnet",
      name: "English WordNet 2025+",
      version: "2025",
      description: "Lexical database for English",
      provider: "Princeton / Open English WordNet",
      language: "en",
      format: "json",
      resourceType: "semantic",
      path: projectRoot("..", "..", "..", "resources", "english-wordnet-2025-plus-json"),
      consumedBy: ["enricher.wordnet"],
      provides: ["feature.wordnet", "definitions", "synonyms", "hypernyms", "domains"],
    });

    ResourceRegistry.register({
      id: "resource.hunspell",
      name: "Hunspell en_US-large",
      version: "2026.02.25",
      description: "Hunspell morphological dictionary",
      provider: "Wordlist / Aspell",
      language: "en-US",
      format: "txt",
      resourceType: "morphology",
      path: projectRoot("..", "..", "..", "resources", "hunspell-en_US-large-2026.02.25"),
      consumedBy: ["enricher.hunspell"],
      provides: ["feature.lemma", "feature.stem", "feature.inflections", "feature.derivations"],
    });

      ResourceRegistry.register({
        id: "resource.wordfreq",
        name: "wordfreq",
        version: "3.1.1",
        description: "Zipf scale frequencies for English",
        provider: "wordfreq",
        language: "en",
        format: "csv",
        resourceType: "frequency",
        path: projectRoot("..", "..", "..", "resources", "wordfreq", "wordfreq-en.csv"),
        consumedBy: ["enricher.frequency"],
        provides: ["feature.frequency"],
      });

      ResourceRegistry.register({
        id: "resource.subtlex",
        name: "SUBTLEX-US",
        version: "1.0",
        description: "Zipf scale frequencies for American English",
        provider: "SUBTLEX",
        language: "en-US",
        format: "txt",
        resourceType: "frequency",
        path: projectRoot("..", "..", "..", "resources", "subtlex.txt"),
        consumedBy: ["enricher.frequency"],
        provides: ["feature.frequency"],
      });

      ResourceRegistry.validateAll();

    // Register Importers
    PipelineRegistry.registerImporter(new WordsAlphaImporter());
    PipelineRegistry.registerImporter(new CmudictImporter());
    
    // Register Transformers
    PipelineRegistry.registerTransformer(new ArpabetToIpaTransformer());
    PipelineRegistry.registerTransformer(new IpaToPhonologyTransformer());
    
    // Register Enrichers
      PipelineRegistry.registerEnricher(new WordNetEnricher());
      PipelineRegistry.registerEnricher(new HunspellEnricher());
      PipelineRegistry.registerEnricher(new FrequencyEnricher());
    
    // Register Validators
    PipelineRegistry.registerValidator(new EmptyWordRule());
    PipelineRegistry.registerValidator(new DuplicateWordRule());
    PipelineRegistry.registerValidator(new PhonologyCountsRule());
    PipelineRegistry.registerValidator(new StressPatternRule());
    PipelineRegistry.registerValidator(new UniqueSemanticsRule());
    PipelineRegistry.registerValidator(new NoEmptySemanticsRule());
    PipelineRegistry.registerValidator(new MorphologyRule());
    PipelineRegistry.registerValidator(new WordFamilyRule());
    PipelineRegistry.registerValidator(new NonAlphabeticRule());
    PipelineRegistry.registerValidator(new ArpabetRule());
      PipelineRegistry.registerValidator(new IpaPresenceRule());
      PipelineRegistry.registerValidator(new HasVowelRule());
      PipelineRegistry.registerValidator(new UnknownIpaRule());
      PipelineRegistry.registerValidator(new FrequencyRule());

    // Register Engines
    PipelineRegistry.registerEngine(new WordFamilyEngine());
    
    // Register Builders
    PipelineRegistry.registerBuilder(new DatasetBuilder());

    // Validate the complete dependency graph
    PipelineRegistry.validateDependencies();
  }

  /**
   * Executes the full pipeline end-to-end.
   */
  static async execute(): Promise<void> {
    const pipelineStart = performance.now();

    // --- Banner ---
    logger.banner(config.compilerVersion);
    logger.info(`Words source:  ${config.wordsAlphaPath}`);
    logger.info(`CMU dict:      ${config.cmudictPath}`);
    logger.info(`Output path:   ${config.outputPath}`);
    logger.info(`Output file:   ${config.outputFilename}`);
    logger.divider();

    // Discover modules
    const importers = PipelineRegistry.getImporters<any>();
    const transformers = PipelineRegistry.getTransformers<any>();
    const enrichers = PipelineRegistry.getEnrichers<any>();
    const engines = PipelineRegistry.getEngines<any>();
    const validators = PipelineRegistry.getValidators<any>();
    const builders = PipelineRegistry.getBuilders<any>();

    // Step 1 & 2: Import (Dynamic but strictly typed internally for known importers)
    // We expect words-alpha and cmudict.
    const wordsImporter = importers.find(i => i.metadata.id === "importer.wordsAlpha");
    const cmuImporter = importers.find(i => i.metadata.id === "importer.cmudict");
    if (!wordsImporter || !cmuImporter) {
      throw new Error("Critical importers missing from registry.");
    }

    logger.step(1, "Importing word list");
    const wordsResult = await logger.time(
      "Word list import",
      () => wordsImporter.import()
    ) as any;

    logger.step(2, "Importing pronunciation dictionary");
    const cmudictResult = await logger.time(
      "CMU dict import",
      () => cmuImporter.import()
    ) as any;

    // Step 3: Normalize
    logger.step(3, "Normalizing data");
    const normalizedData = await logger.time(
      "Normalization",
      async () => normalize(wordsResult.data, cmudictResult.data)
    );

    // Step 4: Merge
    logger.step(4, "Merging datasets");
    let records = await logger.time(
      "Merge",
      async () => merge(normalizedData)
    );

    // Step 5 & 6: Transformers
    // We execute transformers sequentially based on priority
    let transformerWarnings = 0;
    let unknownIpaSymbolsCount = 0;

    for (const transformer of transformers) {
      logger.step(5, `Transforming: ${transformer.name}`);
      const tResult = await logger.time(
        transformer.name,
        async () => transformer.transform(records)
      );
      records = tResult.records;
      transformerWarnings += tResult.warnings.length;

      // Extract unknown IPA symbols specifically if this is the phonology transformer
      // We know it by checking if it produced PhonologyWord which has unknownSymbols array
      // A small hack since we want to preserve exact output
      if (transformer.metadata.id === "transformer.ipaToPhonology") {
        unknownIpaSymbolsCount = records.reduce((sum: number, r: any) => sum + (r.unknownSymbols?.length || 0), 0);
      }
    }

    // Step 7: Enrichers
    for (const enricher of enrichers) {
      logger.step(6, `Enriching: ${enricher.name}`);
      const eResult = await logger.time(
        enricher.name,
        async () => enricher.enrich(records)
      );
      records = eResult.records;
    }

    // Step 7.5: Engines
    for (const engine of engines) {
      logger.step(6.5, `Executing Engine: ${engine.name || (engine as any).metadata?.name}`);
      const eResult = await logger.time(
        engine.name || (engine as any).metadata?.name,
        async () => (engine as any).execute(records)
      );
      records = eResult.records;
    }

    // Step 8: Validate
    logger.step(7, "Validating records");
    const validationReport = await logger.time(
      "Validation",
      async () => validate(records as any, validators)
    );

    // Step 9: Build dataset
    const datasetBuilder = builders.find(b => b.metadata.id === "builder.dataset");
    if (!datasetBuilder) throw new Error("Dataset builder missing from registry.");
    
    logger.step(8, "Building dataset");
    const dataset = await logger.time(
      "Dataset build",
      async () => datasetBuilder.build(records)
    );

    // Step 10: Export
    logger.step(9, "Exporting dataset");
    await logger.time(
      "Export",
      async () => exportDataset({
        entries: dataset,
        validationReport,
        duplicatesRemoved: normalizedData.duplicatesRemoved,
        transformerWarnings,
        unknownIpaSymbolsCount,
        config
      })
    );

    // --- Pipeline Complete ---
    const pipelineDuration = ((performance.now() - pipelineStart) / 1000).toFixed(2);
    logger.divider();
    logger.success(`Pipeline completed successfully in ${pipelineDuration}s`);
  }
}
