import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerContext } from "../types/compiler.js";
import { KnowledgePackage, KnowledgePackageManifest, KnowledgePackageImporter } from "../types/knowledge-package.js";
import { LexEntry } from "../types/index.js";
import { logger } from "../utils/logger.js";
import crypto from "node:crypto";

const phoibleManifest: KnowledgePackageManifest = {
  id: "package.phoible",
  version: "2.0.1",
  schemaVersion: "2.0.0",
  dependencies: [],
  license: "CC-BY-SA",
  importer: "PhoiblePackageImporter",
  mergePolicy: {},
  evidencePolicy: "PHOIBLE 2.0.1",
  confidencePolicy: "static:1.0",
  authoritativeFields: [],
  enrichableFields: [],
  prohibitedFields: [],
};

export class PhoiblePackageImporter implements KnowledgePackageImporter {
  async *import(context: CompilerContext): AsyncGenerator<Partial<LexEntry>, void, unknown> {
    const valuesPath = "D:\\Projects\\resourses\\New Resources\\phoible-v2.0.1\\values.csv";
    
    if (!fs.existsSync(valuesPath)) {
      logger.warn("Phoible dataset not found, skipping.");
      return;
    }

    const rl = createInterface({
      input: fs.createReadStream(valuesPath),
      crlfDelay: Infinity,
    });
    
    let isHeader = true;
    let headers: string[] = [];
    
    // phoible-index.json output
    const phoibleIndex: Record<string, { phonemes: string[] }> = {};

    for await (const line of rl) {
      if (isHeader) {
        headers = line.split(",");
        isHeader = false;
        continue;
      }
      
      const cols = line.split(",");
      const langCode = cols[3]; // LanguageCode
      const phoneme = cols[6];  // Phoneme
      
      if (!phoibleIndex[langCode]) {
         phoibleIndex[langCode] = { phonemes: [] };
      }
      if (!phoibleIndex[langCode].phonemes.includes(phoneme)) {
         phoibleIndex[langCode].phonemes.push(phoneme);
      }
    }
    
    const tmpDir = path.join(context.config.outputPath, "tmp");
    const outPath = path.join(tmpDir, "phoible-index.json");
    fs.writeFileSync(outPath, JSON.stringify(phoibleIndex, null, 2));
    
    context.registerArtifact({
      id: "artifact.index.phoible",
      type: "json",
      passId: "package.phoible",
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: []
    });
    
    logger.info(`Generated phoible-index.json containing ${Object.keys(phoibleIndex).length} language inventories.`);
    
    // Yield nothing since we don't merge into canonical words
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

export const PhoiblePackage: KnowledgePackage = {
  manifest: phoibleManifest,
  importer: new PhoiblePackageImporter()
};
