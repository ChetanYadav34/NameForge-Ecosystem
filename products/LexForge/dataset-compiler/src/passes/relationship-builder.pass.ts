import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";
import { FrequencyWord, RelationshipProvenance } from "../types/index.js";

export interface TypedRelationship {
  source: string;
  target: string;
  type: "synonym" | "antonym" | "hypernym" | "hyponym" | "inflection_of" | "derivation_of" | "in_domain";
  weight: number;
  provenance: RelationshipProvenance;
}

export class RelationshipBuilderPass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.relationship_builder",
    name: "Relationship Builder Pass",
    version: "2.0.0",
    description: "Extracts typed relationships (edges) from feature-rich entities.",
    dependencies: ["pass.knowledge_integration"],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let edgesCreated = 0;
    
    const extractedArtifact = context.getArtifact("artifact.integrated.knowledge");
    
    if (!extractedArtifact) {
      throw new Error("Missing required artifact from KnowledgeIntegrationPass.");
    }
    
    const tmpDir = path.join(context.config.outputPath, "tmp");
    const outPath = path.join(tmpDir, "typed-relationships.jsonl");
    const outStream = fs.createWriteStream(outPath);
    
    const rl = createInterface({
      input: fs.createReadStream(extractedArtifact.path),
      crlfDelay: Infinity,
    });
    
    for await (const line of rl) {
      const entry: FrequencyWord = JSON.parse(line);
      const sourceId = `eng:${entry.word}`;
      
      const writeEdge = (targetWord: string, type: TypedRelationship["type"], weight: number = 1.0, packageSource: string = "core") => {
        const edge: TypedRelationship = {
          source: sourceId,
          target: `eng:${targetWord}`,
          type,
          weight,
          provenance: {
            type,
            confidence: weight,
            evidenceIds: [], // Fill with actual evidence IDs during enrichment
            algorithmId: "relationship-builder",
            algorithmVersion: "2.0.0",
            compilerPass: "pass.relationship_builder",
            packageSource,
            timestamp: new Date().toISOString()
          }
        };
        outStream.write(JSON.stringify(edge) + "\n");
        edgesCreated++;
      };

      // Semantic relationships
      entry.synonyms?.forEach(t => writeEdge(t, "synonym", 1.0, "wordnet"));
      entry.antonyms?.forEach(t => writeEdge(t, "antonym", 1.0, "wordnet"));
      entry.hypernyms?.forEach(t => writeEdge(t, "hypernym", 1.0, "wordnet"));
      entry.hyponyms?.forEach(t => writeEdge(t, "hyponym", 1.0, "wordnet"));
      entry.domains?.forEach(t => writeEdge(t, "in_domain", 1.0, "wordnet"));
      
      // Morphological relationships
      // If we have a lemma, this word is an inflection or derivation of the lemma
      if (entry.lemma && entry.lemma !== entry.word) {
        writeEdge(entry.lemma, "inflection_of", 1.0, "hunspell"); // Approximate for now, WordNet lemma doesn't distinguish inflection/derivation
      }
      
      // Hunspell inflections/derivations map from Lemma -> Inflected Form
      // So if this entry is the lemma, it has derivations
      entry.derivations?.forEach(t => writeEdge(t, "derivation_of", 1.0, "hunspell"));
    }
    
    await new Promise<void>((resolve, reject) => {
      outStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.relationships",
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
      message: `Created ${edgesCreated} typed relationships.`,
    });

    return {
      executionTimeMs: end - start,
      recordsProcessed: edgesCreated,
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
