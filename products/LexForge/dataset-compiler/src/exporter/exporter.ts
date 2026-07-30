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
} from "../types/index.js";
import { logger } from "../utils/logger.js";

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
    sources: ["words_alpha", "cmudict"],
    records: entries.length,
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
