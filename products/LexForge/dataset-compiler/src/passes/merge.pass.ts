import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";
import { CanonicalEntity } from "./canonicalize.pass.js";
import { RawPronunciation, MergedWord } from "../types/index.js";

export class MergePass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.merge",
    name: "Merge Pass",
    version: "2.0.0",
    description: "Merges canonical entities with their pronunciation facts.",
    dependencies: ["pass.entity_resolution", "pass.normalize"], // Depends on both resolved entities and normalized pronunciations
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    
    const entitiesArtifact = context.getArtifact("artifact.resolved.entities");
    const pronunciationsArtifact = context.getArtifact("artifact.normalized.pronunciations");
    
    if (!entitiesArtifact || !pronunciationsArtifact) {
      throw new Error("Missing required artifacts for MergePass.");
    }
    
    // 1. Build lookup maps for pronunciations (fits in memory ~10-20MB)
    const pronunciationsMap = new Map<string, string>();
    const alternatesMap = new Map<string, string[]>();
    
    const cmuRl = createInterface({
      input: fs.createReadStream(pronunciationsArtifact.path),
      crlfDelay: Infinity,
    });
    
    for await (const line of cmuRl) {
      const pron: RawPronunciation = JSON.parse(line);
      if (pron.variant === 1) {
        if (!pronunciationsMap.has(pron.word)) {
          pronunciationsMap.set(pron.word, pron.arpabet);
        }
      } else {
        const existing = alternatesMap.get(pron.word) || [];
        existing.push(pron.arpabet);
        alternatesMap.set(pron.word, existing);
      }
    }
    
    logger.info(`Loaded ${pronunciationsMap.size} primary pronunciations for merging.`);
    
    // 2. Stream through entities and merge
    const tmpDir = path.join(context.config.outputPath, "tmp");
    const mergedPath = path.join(tmpDir, "merged-facts.jsonl");
    const outStream = fs.createWriteStream(mergedPath);
    
    const entitiesRl = createInterface({
      input: fs.createReadStream(entitiesArtifact.path),
      crlfDelay: Infinity,
    });
    
    let withPronunciation = 0;
    
    for await (const line of entitiesRl) {
      const entity: CanonicalEntity = JSON.parse(line);
      
      const arpabet = pronunciationsMap.get(entity.orthography) || "";
      const alternatePronunciations = alternatesMap.get(entity.orthography) || [];
      
      if (arpabet) withPronunciation++;
      
      const mergedRecord: MergedWord = {
        word: entity.orthography,
        arpabet,
        alternatePronunciations,
      };
      
      outStream.write(JSON.stringify(mergedRecord) + "\n");
      recordsProcessed++;
    }
    
    await new Promise<void>((resolve, reject) => {
      outStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.merged.facts",
      type: "jsonl",
      passId: this.metadata.id,
      path: mergedPath,
      hash: await this.hashFile(mergedPath),
      dependencies: [entitiesArtifact.id, pronunciationsArtifact.id]
    });
    
    const end = performance.now();

    context.emitDiagnostic({
      level: "info",
      passId: this.metadata.id,
      message: `Merged ${recordsProcessed} entities. ${withPronunciation} have pronunciations.`,
    });

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
