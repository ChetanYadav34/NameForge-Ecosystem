import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";
import { LexEntry } from "../types/index.js";
import { PackageRegistry } from "../registry/package.registry.js";
import { MergeEngine } from "../engines/merge.engine.js";

export class KnowledgeIntegrationPass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.knowledge_integration",
    name: "Knowledge Integration Pass",
    version: "2.0.0",
    description: "Applies all registered Knowledge Packages sequentially to the base entities.",
    dependencies: ["pass.base_knowledge"],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    
    const baseArtifact = context.getArtifact("artifact.base.knowledge");
    if (!baseArtifact) {
      throw new Error("Missing artifact.base.knowledge");
    }
    
    // 1. Load Base Knowledge into memory (370k records is ~100MB - fits safely)
    const entities = new Map<string, LexEntry>();
    
    logger.info("Loading Base Knowledge into memory for enrichment...");
    const baseRl = createInterface({
      input: fs.createReadStream(baseArtifact.path),
      crlfDelay: Infinity,
    });
    
    for await (const line of baseRl) {
      const entry: LexEntry = JSON.parse(line);
      // Ensure word is the key
      entities.set(entry.word.toLowerCase(), entry);
    }
    logger.info(`Loaded ${entities.size} base entities.`);

    // 2. Execute Packages in dependency order
    const packages = PackageRegistry.buildExecutionOrder();
    logger.info(`Applying ${packages.length} Knowledge Packages...`);

    for (const pkg of packages) {
      logger.step(0, `Applying Knowledge Package: ${pkg.manifest.id}@${pkg.manifest.version}`);
      
      let packageMatches = 0;
      let packageYields = 0;

      // Stream the package's importer
      for await (const patch of pkg.importer.import(context)) {
        packageYields++;
        if (!patch.word) continue;

        const key = patch.word.toLowerCase();
        const existing = entities.get(key);
        
        if (existing) {
          // Merge using the engine and policy
          const merged = MergeEngine.applyPatch(existing, patch, pkg.manifest);
          entities.set(key, merged);
          packageMatches++;
        } else {
          // Allow appending entirely new entities (e.g. WikiPron for non-English)
          if (pkg.manifest.mergePolicy["_new_entity"] === "append-only") {
             entities.set(key, patch as LexEntry);
             packageMatches++;
          }
        }
        
        // Prevent memory starvation by allowing GC breathing room every 100k records
        if (packageYields % 100000 === 0) {
           await new Promise(resolve => setImmediate(resolve));
        }
      }
      
      logger.info(`Package ${pkg.manifest.id} yielded ${packageYields} records. Merged ${packageMatches} into base.`);
    }

    // 3. Write enriched entities back to stream
    const tmpDir = path.join(context.config.outputPath, "tmp");
    const outPath = path.join(tmpDir, "integrated-knowledge.jsonl");
    const outStream = fs.createWriteStream(outPath);
    
    for (const entry of entities.values()) {
       outStream.write(JSON.stringify(entry) + "\n");
       recordsProcessed++;
    }
    
    await new Promise<void>((resolve, reject) => {
      outStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.integrated.knowledge",
      type: "jsonl",
      passId: this.metadata.id,
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: [baseArtifact.id] // plus all package ids if we wanted to be strict
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
