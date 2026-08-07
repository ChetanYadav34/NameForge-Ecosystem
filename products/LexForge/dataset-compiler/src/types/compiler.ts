import { DatasetManifest } from "./index.js";

export interface ArtifactMetadata {
  id: string;
  type: string;
  passId: string;
  path: string;
  hash: string;
  dependencies: string[];
}

/**
 * Diagnostics emitted by compiler passes.
 */
export interface Diagnostic {
  level: "info" | "warning" | "error";
  passId: string;
  entityId?: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

/**
 * Metrics emitted by compiler passes.
 */
export interface PassMetrics {
  executionTimeMs: number;
  recordsProcessed: number;
  recordsSkipped: number;
  memoryUsageMb: number;
  customMetrics?: Record<string, number>;
}

/**
 * Metadata for a compiler pass.
 */
export interface CompilerPassMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  dependencies: string[];
}

/**
 * The immutable context shared across all compiler passes.
 */
export interface CompilerContext {
  readonly version: string;
  readonly sessionId: string;
  readonly startTime: number;
  readonly config: {
    readonly outputPath: string;
    readonly snapshotPath: string;
    readonly enableDiagnostics: boolean;
  };
  
  // Method to safely emit diagnostics without mutating the core context state
  emitDiagnostic(diagnostic: Omit<Diagnostic, "timestamp">): void;
  
  // Artifact tracking
  registerArtifact(metadata: ArtifactMetadata): void;
  getArtifact(id: string): ArtifactMetadata | undefined;
  getAllArtifacts(): ArtifactMetadata[];

  // Close streams and resources held by the context
  close(): Promise<void>;
}

/**
 * The unified interface for every compiler stage.
 */
export interface CompilerPass {
  readonly metadata: CompilerPassMetadata;
  
  /**
   * Executes the pass within the given context.
   * For streaming passes, this should return a stream or async iterator,
   * or perform stream processing internally and return metrics.
   */
  execute(context: CompilerContext): Promise<PassMetrics>;
}
