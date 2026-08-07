import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { FrequencyWord } from "../types/index.js";

export interface ConfidenceMetrics {
  score: number;
  sources: Record<string, number>; // source -> trust_weight
  reliability: "high" | "medium" | "low";
}

export type ScoredWord = FrequencyWord & { confidence: ConfidenceMetrics };

export class ConfidencePass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.confidence",
    name: "Confidence Engine Pass",
    version: "2.0.0",
    description: "Computes confidence scores for linguistic facts based on evidence source authority.",
    dependencies: ["pass.feature_extraction"],
  };

  private readonly SOURCE_TRUST: Record<string, number> = {
    "words_alpha": 0.8,
    "cmudict": 0.95,
    "wordnet": 0.9,
    "hunspell": 0.85,
    "wordfreq": 0.9,
    "subtlex": 0.85,
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    
    const extractedArtifact = context.getArtifact("artifact.extracted.features");
    
    if (!extractedArtifact) {
      throw new Error("Missing required artifact from FeatureExtractionPass.");
    }
    
    const tmpDir = path.join(context.config.outputPath, "tmp");
    const outPath = path.join(tmpDir, "confidence-scored.jsonl");
    const outStream = fs.createWriteStream(outPath);
    
    const rl = createInterface({
      input: fs.createReadStream(extractedArtifact.path),
      crlfDelay: Infinity,
    });
    
    for await (const line of rl) {
      const entry: FrequencyWord = JSON.parse(line);
      
      let totalTrust = 0;
      let maxTrust = 0;
      const sourceScores: Record<string, number> = {};
      
      const sources = entry.sources || ["words_alpha"];
      
      for (const src of sources) {
        const trust = this.SOURCE_TRUST[src] || 0.5;
        sourceScores[src] = trust;
        totalTrust += trust;
        maxTrust = Math.max(maxTrust, trust);
      }
      
      // Calculate a normalized score: higher max trust + more sources = higher confidence
      // Example formula: Cap at 1.0. (maxTrust * 0.7) + (totalTrust / (sources.length * 2)) * 0.3
      const avgTrust = totalTrust / sources.length;
      let score = (maxTrust * 0.7) + (avgTrust * 0.3);
      score = Math.min(1.0, score);
      
      let reliability: ConfidenceMetrics["reliability"] = "low";
      if (score > 0.85) reliability = "high";
      else if (score > 0.7) reliability = "medium";
      
      const confidence: ConfidenceMetrics = {
        score,
        sources: sourceScores,
        reliability
      };
      
      const scoredRecord: ScoredWord = {
        ...entry,
        confidence
      };
      
      outStream.write(JSON.stringify(scoredRecord) + "\n");
      recordsProcessed++;
    }
    
    await new Promise<void>((resolve, reject) => {
      outStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.confidence.scored",
      type: "jsonl",
      passId: this.metadata.id,
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: [extractedArtifact.id]
    });
    
    const end = performance.now();

    context.emitDiagnostic({
      level: "info",
      passId: this.metadata.id,
      message: `Computed confidence metrics for ${recordsProcessed} entities.`,
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
