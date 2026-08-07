import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerContext } from "../types/compiler.js";
import { KnowledgePackage, KnowledgePackageManifest, KnowledgePackageImporter } from "../types/knowledge-package.js";
import { LexEntry } from "../types/index.js";
import { logger } from "../utils/logger.js";
import crypto from "node:crypto";

const brandManifest: KnowledgePackageManifest = {
  id: "package.brand_intelligence",
  version: "1.0.0",
  schemaVersion: "2.0.0",
  dependencies: [],
  license: "Proprietary/Public",
  importer: "BrandIntelligencePackageImporter",
  mergePolicy: {},
  evidencePolicy: "Fortune 1000 & CB Insights Unicorns",
  confidencePolicy: "static:1.0",
  authoritativeFields: [],
  enrichableFields: [],
  prohibitedFields: [],
};

export class BrandIntelligencePackageImporter implements KnowledgePackageImporter {
  async *import(context: CompilerContext): AsyncGenerator<Partial<LexEntry>, void, unknown> {
    const fortunePath = "D:\\Projects\\resourses\\New Resources\\Fortune_1000.csv";
    const unicornPath = "D:\\Projects\\resourses\\New Resources\\Unicorn_Companies.csv";
    
    const brandStats: Record<string, any> = {
      industries: {},
      lengthDistribution: {},
      suffixFrequencies: {},
    };

    if (fs.existsSync(fortunePath)) {
      const rl = createInterface({ input: fs.createReadStream(fortunePath) });
      let isHeader = true;
      for await (const line of rl) {
        if (isHeader) { isHeader = false; continue; }
        const cols = line.split(",");
        const company = cols[0];
        const industry = cols[6];
        if (!company) continue;
        
        this.processBrand(company, industry, brandStats);
      }
    }

    if (fs.existsSync(unicornPath)) {
      const rl = createInterface({ input: fs.createReadStream(unicornPath) });
      let isHeader = true;
      for await (const line of rl) {
        if (isHeader) { isHeader = false; continue; }
        const cols = line.split(",");
        const company = cols[0];
        const industry = cols[5];
        if (!company) continue;
        
        this.processBrand(company, industry, brandStats);
      }
    }

    const tmpDir = path.join(context.config.outputPath, "tmp");
    const outPath = path.join(tmpDir, "brand_statistics.json");
    fs.writeFileSync(outPath, JSON.stringify(brandStats, null, 2));
    
    context.registerArtifact({
      id: "artifact.index.brand",
      type: "json",
      passId: "package.brand_intelligence",
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: []
    });
    
    logger.info(`Generated brand_statistics.json with brand intelligence derived from Fortune and Unicorn datasets.`);
    
    // Yield nothing since we don't merge into canonical words
  }
  
  private processBrand(company: string, industry: string, stats: any) {
    const clean = company.replace(/\b(Inc\.|LLC|Corp\.|Ltd\.)\b/gi, "").trim();
    if (!clean) return;
    
    const len = clean.length;
    stats.lengthDistribution[len] = (stats.lengthDistribution[len] || 0) + 1;
    
    if (industry) {
      if (!stats.industries[industry]) stats.industries[industry] = 0;
      stats.industries[industry]++;
    }
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

export const BrandIntelligencePackage: KnowledgePackage = {
  manifest: brandManifest,
  importer: new BrandIntelligencePackageImporter()
};
