export type MergePolicy = "highest-confidence" | "union-deduplicate" | "preserve-provenance" | "weighted-confidence" | "append-only" | "fail-on-conflict" | "overwrite" | "preserve-all";

export interface KnowledgePackageManifest {
  id: string;
  version: string;
  schemaVersion: string;
  dependencies: string[];
  license: string;
  importer: string;
  validator?: string;
  mergePolicy: Record<string, MergePolicy>; // Field name -> MergePolicy
  evidencePolicy: string;
  confidencePolicy: string;
  authoritativeFields: string[]; // Fields this package owns
  enrichableFields: string[];    // Fields this package can add to
  prohibitedFields: string[];    // Fields this package must not touch
}

export interface RelationshipProvenance {
  type: string;
  confidence: number;
  evidenceIds: string[];
  algorithmId: string;
  algorithmVersion: string;
  compilerPass: string;
  packageSource: string;
  timestamp: string;
}

export interface KnowledgeQualityScore {
  completeness: number;
  consistency: number;
  evidenceCoverage: number;
  confidence: number;
  freshness: number;
  relationshipDensity: number;
  featureCoverage: number;
  overallScore: number;
}

import { CompilerContext } from "./compiler.js";

export interface KnowledgePackageImporter {
  import(context: CompilerContext): AsyncGenerator<Partial<any>, void, unknown>;
}

export interface KnowledgePackage {
  manifest: KnowledgePackageManifest;
  importer: KnowledgePackageImporter;
}
