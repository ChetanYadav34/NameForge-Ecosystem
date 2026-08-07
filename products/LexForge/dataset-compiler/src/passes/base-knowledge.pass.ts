import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";
import { config, projectRoot } from "../config/index.js";

export class BaseKnowledgePass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.base_knowledge",
    name: "Base Knowledge Pass (V6)",
    version: "2.0.0",
    description: "Streams the existing V6 dataset as the immutable base layer.",
    dependencies: [],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    
    const tmpDir = path.join(context.config.outputPath, "tmp");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // Path to the existing V6 dataset
    const v6Path = path.join(context.config.outputPath, "lexforge-dataset-v6.jsonl");
    if (!fs.existsSync(v6Path)) {
        throw new Error(`V6 dataset not found at ${v6Path}. Please ensure V1 pipeline generated it.`);
    }

    const outPath = path.join(tmpDir, "base-knowledge.jsonl");
    const outStream = fs.createWriteStream(outPath);
    
    const rl = createInterface({
      input: fs.createReadStream(v6Path),
      crlfDelay: Infinity,
    });
    
    for await (const line of rl) {
        // We just stream it directly to the temporary artifact for downstream processing
        outStream.write(line + "\n");
        recordsProcessed++;
    }
    
    await new Promise<void>((resolve, reject) => {
      outStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.base.knowledge",
      type: "jsonl",
      passId: this.metadata.id,
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: []
    });
    
    const end = performance.now();
    
    context.emitDiagnostic({
      level: "info",
      passId: this.metadata.id,
      message: `Loaded ${recordsProcessed} entities from V6 Base Knowledge.`,
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
