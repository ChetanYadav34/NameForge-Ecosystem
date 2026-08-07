import fs from "node:fs";
import path from "node:path";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";

export class ArtifactVerificationPass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.artifact_verification",
    name: "Artifact Verification Pass",
    version: "2.0.0",
    description: "Verifies artifact integrity before export (hashes, dependencies).",
    dependencies: ["pass.reporting"],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    
    const artifacts = context.getAllArtifacts();
    const integrityResults: any = {
       verifiedAt: new Date().toISOString(),
       artifacts: {}
    };

    let overallPass = true;
    let recordsProcessed = artifacts.length;

    for (const artifact of artifacts) {
       let result = "PASS";
       let reason = "";

       // 1. Exists
       if (!fs.existsSync(artifact.path)) {
           result = "FAIL";
           reason = "File does not exist on disk.";
       } else {
           // 2. Hash matches
           const actualHash = await this.hashFile(artifact.path);
           if (actualHash !== artifact.hash) {
               result = "FAIL";
               reason = `Hash mismatch. Expected ${artifact.hash}, got ${actualHash}`;
           }

           // 3. Dependency graph integrity
           for (const dep of artifact.dependencies) {
               const depArtifact = context.getArtifact(dep);
               if (!depArtifact) {
                   result = "FAIL";
                   reason = `Missing dependency in registry: ${dep}`;
               }
           }
       }

       if (result === "FAIL") {
           overallPass = false;
       }

       integrityResults.artifacts[artifact.id] = {
           status: result,
           reason,
           path: artifact.path,
           hash: artifact.hash
       };
    }

    const tmpDir = path.join(context.config.outputPath, "tmp");
    const outPath = path.join(tmpDir, "artifact_integrity.json");
    
    integrityResults.overallStatus = overallPass ? "PASS" : "FAIL";

    fs.writeFileSync(outPath, JSON.stringify(integrityResults, null, 2));

    context.registerArtifact({
      id: "artifact.integrity",
      type: "json",
      passId: this.metadata.id,
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: []
    });
    
    logger.info(`Artifact verification completed: ${overallPass ? 'PASS' : 'FAIL'}`);

    if (!overallPass) {
       throw new Error("Artifact Verification Failed. See artifact_integrity.json for details.");
    }

    const end = performance.now();
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
