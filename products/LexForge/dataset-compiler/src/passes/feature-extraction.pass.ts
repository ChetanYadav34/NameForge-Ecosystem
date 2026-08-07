import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";
import { PhonologyWord, SemanticWord, MorphologyWord, FrequencyWord } from "../types/index.js";
import { WordNetEnricher } from "../enrichers/wordnet.enricher.js";
import { HunspellEnricher } from "../enrichers/hunspell.enricher.js";
import { FrequencyEnricher } from "../enrichers/frequency.enricher.js";

export class FeatureExtractionPass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.feature_extraction",
    name: "Feature Extraction Pass",
    version: "2.0.0",
    description: "Applies enrichers (WordNet, Hunspell, Frequency) to extract semantic, morphological, and statistical features.",
    dependencies: ["pass.transformers"],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    
    const transformedArtifact = context.getArtifact("artifact.transformed.facts");
    
    if (!transformedArtifact) {
      throw new Error("Missing required artifact from TransformersPass.");
    }
    
    const tmpDir = path.join(context.config.outputPath, "tmp");
    const outPath = path.join(tmpDir, "extracted-features.jsonl");
    const outStream = fs.createWriteStream(outPath);
    
    const rl = createInterface({
      input: fs.createReadStream(transformedArtifact.path),
      crlfDelay: Infinity,
    });
    
    const wordnet = new WordNetEnricher();
    const hunspell = new HunspellEnricher();
    const freq = new FrequencyEnricher();
    
    let chunk: PhonologyWord[] = [];
    const CHUNK_SIZE = 20000;

    for await (const line of rl) {
      chunk.push(JSON.parse(line));
      
      if (chunk.length >= CHUNK_SIZE) {
        await processChunk(chunk);
        chunk = [];
      }
    }
    
    if (chunk.length > 0) {
      await processChunk(chunk);
    }
    
    async function processChunk(records: PhonologyWord[]) {
      const wResult = await wordnet.enrich(records);
      if (wResult.warnings.length > 0) {
        wResult.warnings.forEach(w => context.emitDiagnostic({ level: "warning", passId: "pass.feature_extraction", message: w }));
      }
      
      const hResult = await hunspell.enrich(wResult.records as unknown as SemanticWord[]);
      if (hResult.warnings.length > 0) {
        hResult.warnings.forEach(w => context.emitDiagnostic({ level: "warning", passId: "pass.feature_extraction", message: w }));
      }
      
      const fResult = await freq.enrich(hResult.records as unknown as MorphologyWord[]);
      if (fResult.warnings.length > 0) {
        fResult.warnings.forEach(w => context.emitDiagnostic({ level: "warning", passId: "pass.feature_extraction", message: w }));
      }
      
      for (const finalEntry of fResult.records) {
        outStream.write(JSON.stringify(finalEntry) + "\n");
        recordsProcessed++;
      }
    }
    
    await new Promise<void>((resolve, reject) => {
      outStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.extracted.features",
      type: "jsonl",
      passId: this.metadata.id,
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: [transformedArtifact.id]
    });
    
    const end = performance.now();

    return {
      executionTimeMs: end - start,
      recordsProcessed,
      recordsSkipped: 0,
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
