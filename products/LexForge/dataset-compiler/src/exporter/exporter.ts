// ============================================================================
// LexForge Dataset Compiler — Exporter
// ============================================================================
// Writes the final dataset to disk in JSONL format and generates:
//   • stats.json            — compilation statistics
//   • dataset.manifest.json — dataset compatibility manifest
//
// JSONL: One JSON object per line, no trailing comma, no wrapping array.
// Uses writable streams for memory-efficient output of large datasets.
// ============================================================================

import { createWriteStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import {
  LexEntry,
  DatasetStats,
  DatasetManifest,
  CompilerConfig,
  ValidationReport,
  PipelineModuleMetadata,
  PipelineModule
} from "../types/index.js";
import { logger } from "../utils/logger.js";
import { FeatureRegistry } from "../registry/feature.registry.js";
import { PipelineRegistry } from "../registry/pipeline.registry.js";
import { ResourceRegistry } from "../registry/resource.registry.js";

/**
 * Parameters for dataset export.
 */
export interface ExportParams {
  entries: LexEntry[];
  validationReport: ValidationReport;
  duplicatesRemoved: number;
  transformerWarnings: number;
  unknownIpaSymbolsCount: number;
  config: CompilerConfig;
}

/**
 * Write a JSON object to a file path.
 */
async function writeJsonFile(filePath: string, data: object): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const writeStream = createWriteStream(filePath, { encoding: "utf-8" });
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);
    writeStream.write(JSON.stringify(data, null, 2) + "\n");
    writeStream.end();
  });
}

/**
 * Export the dataset to JSONL, generate stats.json and dataset.manifest.json.
 */
export async function exportDataset(params: ExportParams): Promise<void> {
  const { entries, validationReport, duplicatesRemoved, transformerWarnings, unknownIpaSymbolsCount, config } = params;

  // Ensure the output directory exists
  await mkdir(config.outputPath, { recursive: true });

  const datasetPath = path.join(config.outputPath, config.outputFilename);
  const statsPath = path.join(config.outputPath, config.statsFilename);
  const manifestPath = path.join(config.outputPath, config.manifestFilename);

  // --- Write JSONL dataset ---
  logger.info(`Writing dataset to: ${datasetPath}`);

  await new Promise<void>((resolve, reject) => {
    const writeStream = createWriteStream(datasetPath, { encoding: "utf-8" });

    writeStream.on("error", reject);
    writeStream.on("finish", resolve);

    for (const entry of entries) {
      writeStream.write(JSON.stringify(entry) + "\n");
    }

    writeStream.end();
  });

  // Get file size
  const fileInfo = await stat(datasetPath);
  const fileSizeMB = (fileInfo.size / (1024 * 1024)).toFixed(2);

  logger.success(
    `Dataset written: ${entries.length.toLocaleString()} entries (${fileSizeMB} MB)`
  );

  // --- Calculate stats ---
  let wordsWithPronunciation = 0;
  let wordsWithIpa = 0;
  let wordsWithPhonemes = 0;
  
  let totalPhonemes = 0;
  let totalVowels = 0;
  let totalConsonants = 0;
  
  let maxPhonemeCount = 0;
  let minPhonemeCount = Infinity;
  
  const vowelFreq = new Map<string, number>();
  const consonantFreq = new Map<string, number>();

  for (const entry of entries) {
    if (entry.arpabet.length > 0) wordsWithPronunciation++;
    if (entry.ipa.length > 0) wordsWithIpa++;
    if (entry.phonemeCount > 0) {
      wordsWithPhonemes++;
      totalPhonemes += entry.phonemeCount;
      totalVowels += entry.vowelCount;
      totalConsonants += entry.consonantCount;
      
      if (entry.phonemeCount > maxPhonemeCount) maxPhonemeCount = entry.phonemeCount;
      if (entry.phonemeCount < minPhonemeCount) minPhonemeCount = entry.phonemeCount;
      
      for (const v of entry.vowels) {
        vowelFreq.set(v, (vowelFreq.get(v) || 0) + 1);
      }
      for (const c of entry.consonants) {
        consonantFreq.set(c, (consonantFreq.get(c) || 0) + 1);
      }
    }
  }

  if (minPhonemeCount === Infinity) minPhonemeCount = 0;

  const wordsWithoutPronunciation = entries.length - wordsWithPronunciation;
  const totalWarnings = validationReport.warnings.length + transformerWarnings;

  let mostCommonVowel: string | null = null;
  let maxVFreq = 0;
  for (const [v, freq] of vowelFreq.entries()) {
    if (freq > maxVFreq) {
      mostCommonVowel = v;
      maxVFreq = freq;
    }
  }

  let mostCommonConsonant: string | null = null;
  let maxCFreq = 0;
  for (const [c, freq] of consonantFreq.entries()) {
    if (freq > maxCFreq) {
      mostCommonConsonant = c;
      maxCFreq = freq;
    }
  }

  let wordsWithDefinitions = 0;
  let wordsWithSynonyms = 0;
  let wordsWithHypernyms = 0;
  let wordsWithHyponyms = 0;
  let totalDefinitions = 0;
  let totalSynonyms = 0;
  let totalHypernyms = 0;
  let totalHyponyms = 0;

  let wordsWithMorphology = 0;
  let totalInflectionsGenerated = 0;
  let totalDerivationsGenerated = 0;

  const uniqueFamilies = new Set<string>();
  let totalFamilyMembers = 0;
  let largestFamily = 0;
  let singletonFamilies = 0;
  let totalFamilyConfidence = 0;

  // --- Frequency Stats ---
  let wordsWithFrequency = 0;
  let totalZipf = 0;
  let highestZipf = -Infinity;
  let lowestZipf = Infinity;
  const zipfValues: number[] = [];
  const frequencyBandDistribution: Record<string, number> = {
    "very-common": 0,
    "common": 0,
    "uncommon": 0,
    "rare": 0,
    "very-rare": 0,
  };
  const frequencyWordsForTop100: { word: string; zipf: number }[] = [];

  for (const entry of entries) {
    if (entry.definitions && entry.definitions.length > 0) {
      wordsWithDefinitions++;
      totalDefinitions += entry.definitions.length;
    }
    if (entry.synonyms && entry.synonyms.length > 0) {
      wordsWithSynonyms++;
      totalSynonyms += entry.synonyms.length;
    }
    if (entry.hypernyms && entry.hypernyms.length > 0) {
      wordsWithHypernyms++;
      totalHypernyms += entry.hypernyms.length;
    }
    if (entry.hyponyms && entry.hyponyms.length > 0) {
      wordsWithHyponyms++;
      totalHyponyms += entry.hyponyms.length;
    }
    
    if (entry.inflections?.length > 0 || entry.derivations?.length > 0) {
      wordsWithMorphology++;
      totalInflectionsGenerated += entry.inflections?.length || 0;
      totalDerivationsGenerated += entry.derivations?.length || 0;
    }

    if (entry.familyId && !uniqueFamilies.has(entry.familyId)) {
      uniqueFamilies.add(entry.familyId);
      totalFamilyMembers += entry.familySize;
      totalFamilyConfidence += entry.familyConfidence;
      if (entry.familySize > largestFamily) largestFamily = entry.familySize;
      if (entry.familySize === 1) singletonFamilies++;
    }
    
    if (entry.frequency) {
      wordsWithFrequency++;
      const zipf = entry.frequency.zipf;
      totalZipf += zipf;
      if (zipf > highestZipf) highestZipf = zipf;
      if (zipf < lowestZipf) lowestZipf = zipf;
      zipfValues.push(zipf);
      
      const band = entry.frequency.band;
      if (frequencyBandDistribution[band] !== undefined) {
        frequencyBandDistribution[band]++;
      }
      
      frequencyWordsForTop100.push({ word: entry.word, zipf });
    }
  }
  
  if (lowestZipf === Infinity) lowestZipf = 0;
  if (highestZipf === -Infinity) highestZipf = 0;
  
  zipfValues.sort((a, b) => a - b);
  const medianZipf = zipfValues.length > 0 
    ? (zipfValues.length % 2 !== 0 
        ? zipfValues[Math.floor(zipfValues.length / 2)] 
        : (zipfValues[zipfValues.length / 2 - 1] + zipfValues[zipfValues.length / 2]) / 2)
    : 0;
    
  frequencyWordsForTop100.sort((a, b) => b.zipf - a.zipf);
  const top100MostCommonWords = frequencyWordsForTop100.slice(0, 100).map(w => w.word);

  const stats: DatasetStats = {
    compilerVersion: config.compilerVersion,
    generatedAt: new Date().toISOString(),
    totalWords: entries.length,
    wordsWithPronunciation,
    wordsWithoutPronunciation,
    wordsWithIpa,
    wordsWithPhonemes,
    averagePhonemeCount: wordsWithPhonemes > 0 ? Number((totalPhonemes / wordsWithPhonemes).toFixed(2)) : 0,
    averageVowelCount: wordsWithPhonemes > 0 ? Number((totalVowels / wordsWithPhonemes).toFixed(2)) : 0,
    averageConsonantCount: wordsWithPhonemes > 0 ? Number((totalConsonants / wordsWithPhonemes).toFixed(2)) : 0,
    maxPhonemeCount,
    minPhonemeCount,
    mostCommonVowel,
    mostCommonConsonant,
    unknownIpaSymbols: unknownIpaSymbolsCount,
    duplicatesRemoved,
    wordsWithDefinitions,
    wordsWithSynonyms,
    wordsWithHypernyms,
    wordsWithHyponyms,
    averageDefinitionsPerWord: wordsWithDefinitions > 0 ? Number((totalDefinitions / wordsWithDefinitions).toFixed(2)) : 0,
    averageSynonymsPerWord: wordsWithSynonyms > 0 ? Number((totalSynonyms / wordsWithSynonyms).toFixed(2)) : 0,
    averageHypernymsPerWord: wordsWithHypernyms > 0 ? Number((totalHypernyms / wordsWithHypernyms).toFixed(2)) : 0,
    averageHyponymsPerWord: wordsWithHyponyms > 0 ? Number((totalHyponyms / wordsWithHyponyms).toFixed(2)) : 0,
    wordsWithMorphology,
    totalInflectionsGenerated,
    totalDerivationsGenerated,
    totalFamilies: uniqueFamilies.size,
    averageFamilySize: uniqueFamilies.size > 0 ? Number((totalFamilyMembers / uniqueFamilies.size).toFixed(2)) : 0,
    largestFamily,
    singletonFamilies,
    averageFamilyConfidence: uniqueFamilies.size > 0 ? Number((totalFamilyConfidence / uniqueFamilies.size).toFixed(2)) : 0,
    wordsWithFrequency,
    missingFrequency: entries.length - wordsWithFrequency,
    coveragePercentage: entries.length > 0 ? Number(((wordsWithFrequency / entries.length) * 100).toFixed(2)) : 0,
    averageZipf: wordsWithFrequency > 0 ? Number((totalZipf / wordsWithFrequency).toFixed(2)) : 0,
    medianZipf,
    highestZipf,
    lowestZipf,
    frequencyBandDistribution,
    top100MostCommonWords,
    warnings: totalWarnings,
  };

  // --- Write stats.json ---
  logger.info(`Writing stats to: ${statsPath}`);
  await writeJsonFile(statsPath, stats);
  logger.success("Stats written");

  // --- Write dataset.manifest.json ---
  logger.info(`Writing manifest to: ${manifestPath}`);

  const manifest: DatasetManifest = {
    dataset: "LexForge",
    datasetVersion: config.datasetVersion,
    compilerVersion: config.compilerVersion,
    schemaVersion: config.schemaVersion,
    generatedAt: stats.generatedAt,
    sources: ["words_alpha", "cmudict", "wordnet"],
    records: entries.length,
    features: FeatureRegistry.getAll().map(f => f.id),
    pipelineStages: PipelineRegistry.getAllModules().map(m => m.metadata.id),
    enabledEnrichers: PipelineRegistry.getEnrichers().map(e => e.metadata.id),
    enabledTransformers: PipelineRegistry.getTransformers().map(t => t.metadata.id),
    enabledValidators: PipelineRegistry.getValidators().map(v => v.metadata.id),
    resources: ResourceRegistry.getAll(),
  };

  await writeJsonFile(manifestPath, manifest);
  logger.success("Manifest written");

  // --- Log summary ---
  logger.divider();
  logger.stat("Total words", stats.totalWords.toLocaleString());
  logger.stat("With pronunciation", stats.wordsWithPronunciation.toLocaleString());
  logger.stat("Without pronunciation", stats.wordsWithoutPronunciation.toLocaleString());
  logger.stat("With IPA", stats.wordsWithIpa.toLocaleString());
  logger.stat("Duplicates removed", stats.duplicatesRemoved.toLocaleString());
  logger.stat("Warnings", stats.warnings.toLocaleString());
  logger.stat("Output", datasetPath);
  logger.stat("File size", `${fileSizeMB} MB`);
}
