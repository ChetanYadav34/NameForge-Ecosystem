import fs from "node:fs";
import path from "node:path";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import { WordsAlphaImporter } from "../importers/words-alpha.importer.js";
import { CmudictImporter } from "../importers/cmudict.importer.js";
import { logger } from "../utils/logger.js";
import crypto from "node:crypto";

export class ImportPass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.import",
    name: "Import Pass",
    version: "2.0.0",
    description: "Streams raw datasets from importers into intermediate artifact files.",
    dependencies: [],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    
    // Ensure output/tmp directory exists for intermediate artifacts
    const tmpDir = path.join(context.config.outputPath, "tmp");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // 1. Run Words Alpha Importer
    const wordsImporter = new WordsAlphaImporter();
    const wordsOutputPath = path.join(tmpDir, "words-alpha.jsonl");
    const wordsStream = fs.createWriteStream(wordsOutputPath);
    
    let wordsCount = 0;
    for await (const record of wordsImporter.import()) {
      wordsStream.write(JSON.stringify(record) + "\n");
      wordsCount++;
    }
    
    await new Promise<void>((resolve, reject) => {
      wordsStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.raw.words",
      type: "jsonl",
      passId: this.metadata.id,
      path: wordsOutputPath,
      hash: await this.hashFile(wordsOutputPath),
      dependencies: []
    });
    
    recordsProcessed += wordsCount;

    // 2. Run CMU Dict Importer
    const cmuImporter = new CmudictImporter();
    const cmuOutputPath = path.join(tmpDir, "cmudict.jsonl");
    const cmuStream = fs.createWriteStream(cmuOutputPath);
    
    let cmuCount = 0;
    for await (const record of cmuImporter.import()) {
      cmuStream.write(JSON.stringify(record) + "\n");
      cmuCount++;
    }
    
    await new Promise<void>((resolve, reject) => {
      cmuStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.raw.pronunciations",
      type: "jsonl",
      passId: this.metadata.id,
      path: cmuOutputPath,
      hash: await this.hashFile(cmuOutputPath),
      dependencies: []
    });
    
    recordsProcessed += cmuCount;
    
    const end = performance.now();
    
    context.emitDiagnostic({
      level: "info",
      passId: this.metadata.id,
      message: `Import complete: ${wordsCount} words, ${cmuCount} pronunciations.`,
    });

    return {
      executionTimeMs: end - start,
      recordsProcessed,
      recordsSkipped: 0,
      memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
      customMetrics: {
        wordsImported: wordsCount,
        pronunciationsImported: cmuCount
      }
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
