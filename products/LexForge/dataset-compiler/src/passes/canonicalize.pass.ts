import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";

export interface CanonicalEntity {
  id: string; // e.g. "eng:apple"
  language: string;
  orthography: string;
  isAlias: boolean;
  canonicalId?: string; // If this is an alias, points to the canonical ID
}

export class CanonicalizePass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.canonicalize",
    name: "Canonicalize Pass",
    version: "2.0.0",
    description: "Transforms normalized words into Canonical Linguistic Entities.",
    dependencies: ["pass.normalize"],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    
    const wordsArtifact = context.getArtifact("artifact.normalized.words");
    
    if (!wordsArtifact) {
      throw new Error("Missing required artifact from NormalizePass.");
    }
    
    const tmpDir = path.join(context.config.outputPath, "tmp");
    const canonicalPath = path.join(tmpDir, "canonical-entities.jsonl");
    const outStream = fs.createWriteStream(canonicalPath);
    
    const rl = createInterface({
      input: fs.createReadStream(wordsArtifact.path),
      crlfDelay: Infinity,
    });
    
    for await (const line of rl) {
      const entry = JSON.parse(line);
      const word = entry.word;
      
      const entity: CanonicalEntity = {
        id: `eng:${word}`,
        language: "eng",
        orthography: word,
        isAlias: false // We will handle alias resolution in EntityResolutionPass
      };
      
      outStream.write(JSON.stringify(entity) + "\n");
      recordsProcessed++;
    }
    
    await new Promise<void>((resolve, reject) => {
      outStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.canonical.entities",
      type: "jsonl",
      passId: this.metadata.id,
      path: canonicalPath,
      hash: await this.hashFile(canonicalPath),
      dependencies: [wordsArtifact.id]
    });
    
    const end = performance.now();
    
    context.emitDiagnostic({
      level: "info",
      passId: this.metadata.id,
      message: `Canonicalized ${recordsProcessed} entities.`,
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
