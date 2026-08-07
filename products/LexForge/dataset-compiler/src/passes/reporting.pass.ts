import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";
import { LexEntry } from "../types/index.js";
import { PackageRegistry } from "../registry/package.registry.js";
import { config } from "../config/index.js";

export class ReportingPass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.reporting",
    name: "Reporting Pass",
    version: "2.0.0",
    description: "Generates comprehensive compilation reports: merge, coverage, quality, and statistics.",
    dependencies: ["pass.index_builder"],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    
    const validatedArtifact = context.getArtifact("artifact.validated");
    if (!validatedArtifact) {
      throw new Error("Missing required artifact from ValidationPass.");
    }

    const mergeReport: Record<string, number> = {};
    const coverageReport: Record<string, number> = {
      totalRecords: 0,
      withIpa: 0,
      withDefinitions: 0,
      withSynonyms: 0,
      withMorphology: 0
    };
    const qualityReport: any = {
      averageCompleteness: 0,
      averageConsistency: 0,
      averageOverall: 0,
      distribution: {
         high: 0, // > 0.8
         medium: 0, // 0.5 - 0.8
         low: 0 // < 0.5
      }
    };
    const datasetStats: any = {
      totalRecords: 0,
      averageLength: 0,
      partOfSpeechDistribution: {},
      sourcesDistribution: {}
    };

    let totalLength = 0;
    let totalCompleteness = 0;
    let totalConsistency = 0;
    let totalOverall = 0;

    const rl = createInterface({
      input: fs.createReadStream(validatedArtifact.path),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const entry: LexEntry = JSON.parse(line);
      recordsProcessed++;
      
      coverageReport.totalRecords++;
      datasetStats.totalRecords++;
      
      // Coverage
      if (entry.ipa) coverageReport.withIpa++;
      if (entry.definitions?.length > 0) coverageReport.withDefinitions++;
      if (entry.synonyms?.length > 0) coverageReport.withSynonyms++;
      if (entry.stem || entry.lemma) coverageReport.withMorphology++;

      // Quality
      if (entry.qualityScore) {
          const qs = entry.qualityScore;
          totalCompleteness += qs.completeness;
          totalConsistency += qs.consistency;
          totalOverall += qs.overallScore;

          if (qs.overallScore >= 0.8) qualityReport.distribution.high++;
          else if (qs.overallScore >= 0.5) qualityReport.distribution.medium++;
          else qualityReport.distribution.low++;
      }

      // Stats
      totalLength += entry.length || entry.word.length;
      if (entry.partOfSpeech) {
          for (const pos of entry.partOfSpeech) {
              datasetStats.partOfSpeechDistribution[pos] = (datasetStats.partOfSpeechDistribution[pos] || 0) + 1;
          }
      }
      if (entry.sources) {
          for (const src of entry.sources) {
              datasetStats.sourcesDistribution[src] = (datasetStats.sourcesDistribution[src] || 0) + 1;
              mergeReport[src] = (mergeReport[src] || 0) + 1;
          }
      }
    }

    if (recordsProcessed > 0) {
      qualityReport.averageCompleteness = totalCompleteness / recordsProcessed;
      qualityReport.averageConsistency = totalConsistency / recordsProcessed;
      qualityReport.averageOverall = totalOverall / recordsProcessed;
      datasetStats.averageLength = totalLength / recordsProcessed;
    }

    const tmpDir = path.join(context.config.outputPath, "tmp");
    
    await this.writeReport(context, "merge_report", mergeReport, tmpDir);
    await this.writeReport(context, "coverage_report", coverageReport, tmpDir);
    await this.writeReport(context, "quality_report", qualityReport, tmpDir);
    await this.writeReport(context, "dataset_statistics", datasetStats, tmpDir);

    const end = performance.now();
    return {
      executionTimeMs: end - start,
      recordsProcessed,
      recordsSkipped: 0,
      memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
    };
  }

  private async writeReport(context: CompilerContext, name: string, data: any, tmpDir: string) {
    const outPath = path.join(tmpDir, `${name}.json`);
    const wrapper = {
        metadata: {
           generatedAt: new Date().toISOString(),
           datasetVersion: config.datasetVersion
        },
        data
    };
    fs.writeFileSync(outPath, JSON.stringify(wrapper, null, 2));
    
    context.registerArtifact({
      id: `artifact.report.${name}`,
      type: "json",
      passId: this.metadata.id,
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: ["artifact.validated"]
    });
    
    logger.info(`Generated ${name}.json`);
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
