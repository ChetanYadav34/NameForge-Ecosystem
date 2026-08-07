import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";
import { MergedWord, PhonologyWord, TransformedWord } from "../types/index.js";
import { ArpabetToIpaTransformer } from "../transformers/arpabet-to-ipa.transformer.js";
import { IpaToPhonologyTransformer } from "../transformers/ipa-to-phonology.transformer.js";

export class TransformersPass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.transformers",
    name: "Transformers Pass",
    version: "2.0.0",
    description: "Applies lexical transformations (ARPABET -> IPA -> Phonology).",
    dependencies: ["pass.merge"],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    
    const mergedArtifact = context.getArtifact("artifact.merged.facts");
    
    if (!mergedArtifact) {
      throw new Error("Missing required artifact from MergePass.");
    }
    
    const tmpDir = path.join(context.config.outputPath, "tmp");
    const outPath = path.join(tmpDir, "transformed-facts.jsonl");
    const outStream = fs.createWriteStream(outPath);
    
    const rl = createInterface({
      input: fs.createReadStream(mergedArtifact.path),
      crlfDelay: Infinity,
    });
    
    const arpabetTransformer = new ArpabetToIpaTransformer();
    const phonologyTransformer = new IpaToPhonologyTransformer();
    
    let chunk: MergedWord[] = [];
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
    
    async function processChunk(records: MergedWord[]) {
      const t1Result = await arpabetTransformer.transform(records);
      if (t1Result.warnings.length > 0) {
        t1Result.warnings.forEach(w => context.emitDiagnostic({ level: "warning", passId: "pass.transformers", message: w }));
      }
      
      const t2Result = await phonologyTransformer.transform(t1Result.records as unknown as TransformedWord[]);
      if (t2Result.warnings.length > 0) {
        t2Result.warnings.forEach(w => context.emitDiagnostic({ level: "warning", passId: "pass.transformers", message: w }));
      }
      
      for (const finalEntry of t2Result.records) {
        outStream.write(JSON.stringify(finalEntry) + "\n");
        recordsProcessed++;
      }
    }
    
    await new Promise<void>((resolve, reject) => {
      outStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.transformed.facts",
      type: "jsonl",
      passId: this.metadata.id,
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: [mergedArtifact.id]
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
