import { CompilerContext, Diagnostic } from "../types/compiler.js";
import { config } from "../config/index.js";
import crypto from "node:crypto";

import fs from "node:fs";
import path from "node:path";

export interface ArtifactMetadata {
  id: string;
  type: string;
  passId: string;
  path: string;
  hash: string;
  dependencies: string[];
}

export class DefaultCompilerContext implements CompilerContext {
  public readonly version: string;
  public readonly sessionId: string;
  public readonly startTime: number;
  public readonly config: {
    readonly outputPath: string;
    readonly snapshotPath: string;
    readonly enableDiagnostics: boolean;
  };

  private diagnosticsStream: fs.WriteStream;
  private artifacts: Map<string, ArtifactMetadata> = new Map();

  constructor() {
    this.version = config.compilerVersion;
    this.sessionId = crypto.randomUUID();
    this.startTime = Date.now();
    this.config = {
      outputPath: config.outputPath,
      snapshotPath: config.outputPath.replace("output", "output/snapshots"),
      enableDiagnostics: true,
    };
    
    // Ensure output dir exists
    if (!fs.existsSync(this.config.outputPath)) {
      fs.mkdirSync(this.config.outputPath, { recursive: true });
    }
    
    const diagPath = path.join(this.config.outputPath, "diagnostics.jsonl");
    this.diagnosticsStream = fs.createWriteStream(diagPath, { flags: 'a' });
  }

  emitDiagnostic(diagnostic: Omit<Diagnostic, "timestamp">): void {
    if (!this.config.enableDiagnostics) return;
    
    const fullDiagnostic: Diagnostic = {
      ...diagnostic,
      timestamp: new Date().toISOString()
    };
    
    this.diagnosticsStream.write(JSON.stringify(fullDiagnostic) + "\n");
  }

  registerArtifact(metadata: ArtifactMetadata): void {
    this.artifacts.set(metadata.id, metadata);
  }

  getArtifact(id: string): ArtifactMetadata | undefined {
    return this.artifacts.get(id);
  }

  getAllArtifacts(): ArtifactMetadata[] {
    return Array.from(this.artifacts.values());
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.diagnosticsStream.end((err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
