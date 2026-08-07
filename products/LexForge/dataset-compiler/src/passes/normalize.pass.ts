import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import { RawWord, RawPronunciation } from "../types/index.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";

export class NormalizePass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.normalize",
    name: "Normalize Pass",
    version: "2.0.0",
    description: "Cleans, lowercases, and deduplicates imported raw datasets.",
    dependencies: ["pass.import"],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    
    const wordsArtifact = context.getArtifact("artifact.raw.words");
    const cmuArtifact = context.getArtifact("artifact.raw.pronunciations");
    
    if (!wordsArtifact || !cmuArtifact) {
      throw new Error("Missing required artifacts from ImportPass.");
    }
    
    const tmpDir = path.join(context.config.outputPath, "tmp");
    
    // 1. Normalize Words
    const normWordsPath = path.join(tmpDir, "normalized-words.jsonl");
    const wordsOutStream = fs.createWriteStream(normWordsPath);
    
    const wordSet = new Set<string>();
    let wordsDuplicates = 0;
    
    const wordsRl = createInterface({
      input: fs.createReadStream(wordsArtifact.path),
      crlfDelay: Infinity,
    });
    
    for await (const line of wordsRl) {
      const entry: RawWord = JSON.parse(line);
      const normalized = entry.word.trim().toLowerCase();
      
      if (normalized.length === 0) continue;
      
      if (wordSet.has(normalized)) {
        wordsDuplicates++;
        continue;
      }
      
      wordSet.add(normalized);
      // We buffer to a JSONL file to stream down the pipeline
      wordsOutStream.write(JSON.stringify({ word: normalized }) + "\n");
      recordsProcessed++;
    }
    
    await new Promise<void>((resolve, reject) => {
      wordsOutStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.normalized.words",
      type: "jsonl",
      passId: this.metadata.id,
      path: normWordsPath,
      hash: await this.hashFile(normWordsPath),
      dependencies: [wordsArtifact.id]
    });
    
    // 2. Normalize Pronunciations
    const normCmuPath = path.join(tmpDir, "normalized-cmu.jsonl");
    const cmuOutStream = fs.createWriteStream(normCmuPath);
    
    const cmuRl = createInterface({
      input: fs.createReadStream(cmuArtifact.path),
      crlfDelay: Infinity,
    });
    
    // We can stream these directly, they just need to be lowercased
    let cmuCount = 0;
    for await (const line of cmuRl) {
      const entry: RawPronunciation = JSON.parse(line);
      const normalizedWord = entry.word.trim().toLowerCase();
      
      if (normalizedWord.length === 0) continue;
      
      const normalizedEntry: RawPronunciation = {
        word: normalizedWord,
        arpabet: entry.arpabet,
        variant: entry.variant
      };
      
      cmuOutStream.write(JSON.stringify(normalizedEntry) + "\n");
      recordsProcessed++;
      cmuCount++;
    }
    
    await new Promise<void>((resolve, reject) => {
      cmuOutStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.normalized.pronunciations",
      type: "jsonl",
      passId: this.metadata.id,
      path: normCmuPath,
      hash: await this.hashFile(normCmuPath),
      dependencies: [cmuArtifact.id]
    });

    const end = performance.now();

    context.emitDiagnostic({
      level: "info",
      passId: this.metadata.id,
      message: `Normalization complete: ${wordSet.size} unique words, ${wordsDuplicates} duplicates removed. ${cmuCount} pronunciations normalized.`,
    });

    return {
      executionTimeMs: end - start,
      recordsProcessed,
      recordsSkipped: wordsDuplicates,
      memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
    };
  }
  
  private hashFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('error', err => reject(err));
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }
}
