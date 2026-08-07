import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { ScoredWord } from "./confidence.pass.js";
import { TypedRelationship } from "./relationship-builder.pass.js";
import { DatasetStats } from "../types/index.js";
import { logger } from "../utils/logger.js";

export class StatisticsPass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.statistics",
    name: "Statistics Engine Pass",
    version: "2.0.0",
    description: "Computes global statistics over the canonical entities and relationships.",
    dependencies: ["pass.validation", "pass.relationship_builder"],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    
    const validatedArtifact = context.getArtifact("artifact.validated");
    const relationshipsArtifact = context.getArtifact("artifact.relationships");
    
    if (!validatedArtifact || !relationshipsArtifact) {
      throw new Error("Missing required artifacts for StatisticsPass.");
    }
    
    const stats = {
      totalWords: 0,
      withPronunciation: 0,
      withSemantics: 0,
      withMorphology: 0,
      averagePhonemes: 0,
      averageSyllables: 0,
      posDistribution: {} as Record<string, number>,
      relationshipCounts: {} as Record<string, number>
    };

    let totalPhonemes = 0;
    let totalSyllables = 0;
    
    // Process Validated Entities
    const entityRl = createInterface({
      input: fs.createReadStream(validatedArtifact.path),
      crlfDelay: Infinity,
    });
    
    for await (const line of entityRl) {
      const entry: ScoredWord = JSON.parse(line);
      stats.totalWords++;
      
      if (entry.arpabet) stats.withPronunciation++;
      if (entry.definitions && entry.definitions.length > 0) stats.withSemantics++;
      if (entry.inflections && entry.inflections.length > 0) stats.withMorphology++;
      
      if ((entry as any).phonemes) totalPhonemes += (entry as any).phonemes.length;
      if ((entry as any).syllables) totalSyllables += (entry as any).syllables.length;
      
      if (entry.partOfSpeech) {
        for (const pos of entry.partOfSpeech) {
          stats.posDistribution[pos] = (stats.posDistribution[pos] || 0) + 1;
        }
      }
    }
    
    stats.averagePhonemes = stats.totalWords > 0 ? totalPhonemes / stats.totalWords : 0;
    stats.averageSyllables = stats.totalWords > 0 ? totalSyllables / stats.totalWords : 0;
    
    // Process Relationships
    const edgeRl = createInterface({
      input: fs.createReadStream(relationshipsArtifact.path),
      crlfDelay: Infinity,
    });
    
    for await (const line of edgeRl) {
      const edge: TypedRelationship = JSON.parse(line);
      stats.relationshipCounts[edge.type] = (stats.relationshipCounts[edge.type] || 0) + 1;
    }
    
    const outPath = path.join(context.config.outputPath, "statistics.json");
    fs.writeFileSync(outPath, JSON.stringify(stats, null, 2));
    
    context.registerArtifact({
      id: "artifact.statistics",
      type: "json",
      passId: this.metadata.id,
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: [validatedArtifact.id, relationshipsArtifact.id]
    });
    
    const end = performance.now();

    context.emitDiagnostic({
      level: "info",
      passId: this.metadata.id,
      message: `Calculated statistics for ${stats.totalWords} entities and recorded in statistics.json.`,
    });

    return {
      executionTimeMs: end - start,
      recordsProcessed: stats.totalWords,
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
