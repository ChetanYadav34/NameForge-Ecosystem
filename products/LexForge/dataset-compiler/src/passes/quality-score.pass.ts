import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";
import { LexEntry, KnowledgeQualityScore } from "../types/index.js";

export class QualityScorePass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.quality_score",
    name: "Knowledge Quality Score Pass",
    version: "1.0.0",
    description: "Computes and persists Knowledge Quality Scores for every canonical entity.",
    dependencies: ["pass.relationship_builder"], // runs after relationships are built
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    
    // We will read the integrated knowledge artifact that contains LexEntry.
    const inputArtifact = context.getArtifact("artifact.integrated.knowledge");
    
    if (!inputArtifact) {
      throw new Error("Missing required artifact from KnowledgeIntegrationPass.");
    }
    
    const tmpDir = path.join(context.config.outputPath, "tmp");
    const outPath = path.join(tmpDir, "scored-entities.jsonl");
    const outStream = fs.createWriteStream(outPath);
    
    const rl = createInterface({
      input: fs.createReadStream(inputArtifact.path),
      crlfDelay: Infinity,
    });
    
    // Since relationship pass just wrote edges to a file, we could count relationships per entity,
    // but for streaming simplicity we'll just check what the entity has directly.
    for await (const line of rl) {
      const entry: LexEntry = JSON.parse(line);
      
      const completeness = this.calculateCompleteness(entry);
      const featureCoverage = this.calculateFeatureCoverage(entry);
      const consistency = this.calculateConsistency(entry);
      
      const score: KnowledgeQualityScore = {
        completeness,
        consistency,
        evidenceCoverage: entry.sources ? Math.min(1.0, entry.sources.length * 0.33) : 0.0,
        confidence: 0.9, // Base confidence, could be dynamic
        freshness: 1.0,  // Since it's freshly compiled
        relationshipDensity: this.calculateRelationshipDensity(entry),
        featureCoverage,
        overallScore: 0
      };

      score.overallScore = (
        score.completeness * 0.3 + 
        score.featureCoverage * 0.3 + 
        score.evidenceCoverage * 0.15 + 
        score.consistency * 0.15 + 
        score.relationshipDensity * 0.1
      );

      entry.qualityScore = score;
      outStream.write(JSON.stringify(entry) + "\n");
      recordsProcessed++;
    }
    
    await new Promise<void>((resolve, reject) => {
      outStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.scored",
      type: "jsonl",
      passId: this.metadata.id,
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: [inputArtifact.id]
    });
    
    const end = performance.now();

    return {
      executionTimeMs: end - start,
      recordsProcessed,
      recordsSkipped: 0,
      memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
    };
  }

  private calculateCompleteness(entry: LexEntry): number {
    let score = 0;
    if (entry.ipa) score += 0.2;
    if (entry.definitions?.length > 0) score += 0.2;
    if (entry.partOfSpeech?.length > 0) score += 0.2;
    if (entry.frequency) score += 0.2;
    if (entry.wordFamily?.length > 0) score += 0.2;
    return score;
  }

  private calculateFeatureCoverage(entry: LexEntry): number {
    let score = 0;
    if (entry.syllables?.length > 0) score += 0.2;
    if (entry.stressPattern) score += 0.2;
    if (entry.phonemes?.length > 0) score += 0.2;
    if (entry.vowels?.length > 0) score += 0.2;
    if (entry.consonants?.length > 0) score += 0.2;
    return score;
  }

  private calculateConsistency(entry: LexEntry): number {
    // e.g., if phoneme count matches length of phonemes array
    if (entry.phonemes && entry.phonemeCount === entry.phonemes.length) return 1.0;
    return 0.5;
  }

  private calculateRelationshipDensity(entry: LexEntry): number {
    let count = 0;
    count += entry.synonyms?.length || 0;
    count += entry.antonyms?.length || 0;
    count += entry.hypernyms?.length || 0;
    count += entry.hyponyms?.length || 0;
    count += entry.domains?.length || 0;
    return Math.min(1.0, count * 0.1);
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
