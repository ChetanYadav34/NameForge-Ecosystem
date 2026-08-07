import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";
import { LexEntry } from "../types/index.js";
import { PackageRegistry } from "../registry/package.registry.js";
import { config } from "../config/index.js";

export class IndexBuilderPass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.index_builder",
    name: "Index Builder Pass",
    version: "2.0.0",
    description: "Generates semantic, IPA, morpheme, relationship, and feature indexes.",
    dependencies: ["pass.validation"],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    
    const validatedArtifact = context.getArtifact("artifact.validated");
    if (!validatedArtifact) {
      throw new Error("Missing required artifact from ValidationPass.");
    }

    const semanticIndex: Record<string, string[]> = Object.create(null);
    const ontologyIndex: Record<string, string[]> = Object.create(null);
    const ipaIndex: Record<string, string[]> = Object.create(null);
    const morphemeIndex: Record<string, string[]> = Object.create(null);
    const relationshipIndex: Record<string, string[]> = Object.create(null);
    const featureIndex: Record<string, string[]> = Object.create(null);
    const definitionIndex: Record<string, string> = Object.create(null);

    const rl = createInterface({
      input: fs.createReadStream(validatedArtifact.path),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const entry: LexEntry = JSON.parse(line);
      const word = entry.word;
      
      // Semantic Index (Synonyms + Definitions)
      const indexSemantic = (token: string) => {
          if (!token || token.length < 3) return;
          const k = token.toLowerCase().trim();
          if (!semanticIndex[k]) semanticIndex[k] = [];
          if (semanticIndex[k].length < 150) { // Bounded inverted index
              semanticIndex[k].push(word);
          }
      };

      if (entry.synonyms) entry.synonyms.forEach(indexSemantic);
      if (entry.definitions && entry.definitions.length > 0) {
          definitionIndex[word] = entry.definitions[0];
          entry.definitions.forEach(def => {
             const tokens = def.replace(/[^a-zA-Z\s]/g, '').split(/\s+/);
             tokens.forEach(indexSemantic);
          });
      }

      // Ontology Index (Hypernyms, Hyponyms, Domains, Categories)
      const indexOntology = (category: string) => {
          if (!category) return;
          const k = category.toLowerCase().trim();
          if (!ontologyIndex[k]) ontologyIndex[k] = [];
          if (ontologyIndex[k].length < 150) {
              ontologyIndex[k].push(word);
          }
      };
      
      if (entry.hypernyms) entry.hypernyms.forEach(indexOntology);
      if (entry.hyponyms) entry.hyponyms.forEach(indexOntology);
      if (entry.domains) entry.domains.forEach(indexOntology);
      if (entry.categories) entry.categories.forEach(indexOntology);

      // IPA Index
      if (entry.ipa) {
         if (!ipaIndex[entry.ipa]) ipaIndex[entry.ipa] = [];
         ipaIndex[entry.ipa].push(word);
      }

      // Morpheme Index (using stem or lemma)
      if (entry.stem) {
         if (!morphemeIndex[entry.stem]) morphemeIndex[entry.stem] = [];
         morphemeIndex[entry.stem].push(word);
      }
      if (entry.lemma && entry.lemma !== entry.stem) {
         if (!morphemeIndex[entry.lemma]) morphemeIndex[entry.lemma] = [];
         morphemeIndex[entry.lemma].push(word);
      }

      // Relationship Index (Antonyms, etc.)
      if (entry.antonyms) {
         for (const rel of entry.antonyms) {
            if (!relationshipIndex[rel]) relationshipIndex[rel] = [];
            relationshipIndex[rel].push(word);
         }
      }

      // Feature Index (Length and partOfSpeech)
      const lenKey = `len:${entry.length || word.length}`;
      if (!featureIndex[lenKey]) featureIndex[lenKey] = [];
      featureIndex[lenKey].push(word);

      if (entry.partOfSpeech) {
         for (const pos of entry.partOfSpeech) {
             const posKey = `pos:${pos}`;
             if (!featureIndex[posKey]) featureIndex[posKey] = [];
             featureIndex[posKey].push(word);
         }
      }

      recordsProcessed++;
    }

    const tmpDir = path.join(context.config.outputPath, "tmp");
    
    await this.writeIndex(context, "semantic", semanticIndex, tmpDir);
    await this.writeIndex(context, "ontology", ontologyIndex, tmpDir);
    await this.writeIndex(context, "ipa", ipaIndex, tmpDir);
    await this.writeIndex(context, "morpheme", morphemeIndex, tmpDir);
    await this.writeIndex(context, "relationship", relationshipIndex, tmpDir);
    await this.writeIndex(context, "feature", featureIndex, tmpDir);
    await this.writeIndex(context, "definition", definitionIndex, tmpDir);

    const end = performance.now();
    return {
      executionTimeMs: end - start,
      recordsProcessed,
      recordsSkipped: 0,
      memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
    };
  }

  private async writeIndex(
    context: CompilerContext, 
    indexName: string, 
    data: any, 
    tmpDir: string
  ) {
    const outPath = path.join(tmpDir, `${indexName}-index.json`);
    
    // Metadata block
    const indexWrapper = {
       metadata: {
         version: config.datasetVersion,
         schemaVersion: config.schemaVersion,
         generatedAt: new Date().toISOString(),
         recordCount: Object.keys(data).length,
         compilerVersion: context.version,
         algorithmVersion: "2.0.0",
         dependencies: ["artifact.validated"],
         knowledgePackages: PackageRegistry.getAll().map(p => p.manifest.id)
       },
       data
    };

    fs.writeFileSync(outPath, JSON.stringify(indexWrapper, null, 2));
    
    context.registerArtifact({
      id: `artifact.index.${indexName}`,
      type: "json",
      passId: this.metadata.id,
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: ["artifact.validated"]
    });
    
    logger.info(`Generated ${indexName}-index.json with ${indexWrapper.metadata.recordCount} keys.`);
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
