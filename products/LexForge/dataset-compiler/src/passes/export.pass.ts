import fs from "node:fs";
import path from "node:path";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";
import { config } from "../config/index.js";

export class ExportPass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.export",
    name: "Knowledge Package Export Pass",
    version: "2.0.0",
    description: "Exports the final Knowledge Package and Artifact Dependency Graph.",
    dependencies: ["pass.artifact_verification"],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    
    const validatedArtifact = context.getArtifact("artifact.validated");
    if (!validatedArtifact) throw new Error("Missing artifact.validated");
    
    // Copy main dataset
    const outDatasetPath = path.join(context.config.outputPath, config.outputFilename || "lexforge-dataset-v7.jsonl");
    await fs.promises.copyFile(validatedArtifact.path, outDatasetPath);

    // Get all verified artifacts (excluding temporary files and earlier passes if not needed, but for now we copy indexes, reports, integrity)
    const artifacts = context.getAllArtifacts();
    const finalArtifacts = [];

    for (const artifact of artifacts) {
        if (artifact.id.startsWith("artifact.index.") || artifact.id.startsWith("artifact.report.") || artifact.id === "artifact.integrity") {
            const fileName = path.basename(artifact.path);
            const finalPath = path.join(context.config.outputPath, fileName);
            await fs.promises.copyFile(artifact.path, finalPath);
            finalArtifacts.push({
                ...artifact,
                path: finalPath
            });
        } else if (artifact.id === "artifact.validated") {
             finalArtifacts.push({
                 ...artifact,
                 path: outDatasetPath
             });
        }
    }

    // Generate Knowledge Manifest
    const knowledgeManifestPath = path.join(context.config.outputPath, "knowledge-manifest.json");
    const knowledgeManifest = {
       dataset: "LexForge",
       version: config.datasetVersion,
       schemaVersion: config.schemaVersion,
       generatedAt: new Date().toISOString(),
       primaryDataset: path.basename(outDatasetPath),
       indexes: finalArtifacts.filter(a => a.id.startsWith("artifact.index.")).map(a => path.basename(a.path)),
       reports: finalArtifacts.filter(a => a.id.startsWith("artifact.report.")).map(a => path.basename(a.path)),
    };
    await fs.promises.writeFile(knowledgeManifestPath, JSON.stringify(knowledgeManifest, null, 2));

    const manifestPath = path.join(context.config.outputPath, "snapshot_manifest.json");
    const snapshotManifest = {
      dataset: "LexForge",
      compilerVersion: context.version,
      sessionId: context.sessionId,
      generatedAt: new Date().toISOString(),
      artifacts: finalArtifacts.map(a => ({
        id: a.id,
        type: a.type,
        passId: a.passId,
        path: a.path,
        hash: a.hash,
        dependencies: a.dependencies
      }))
    };
    
    await fs.promises.writeFile(manifestPath, JSON.stringify(snapshotManifest, null, 2));

    context.emitDiagnostic({
      level: "info",
      passId: this.metadata.id,
      message: `Exported final dataset and manifests to ${context.config.outputPath}.`,
    });

    const end = performance.now();
    return {
      executionTimeMs: end - start,
      recordsProcessed: 1,
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
