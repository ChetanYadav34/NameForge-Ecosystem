import { SignaturePattern, CategorySignature } from "../intelligence/types";

export interface EvidenceTrace {
  signaturePatterns: SignaturePattern[];
}

export interface PatternCluster extends EvidenceTrace {
  id: string;
  name: string;
  description: string;
  patterns: SignaturePattern[];
}

export interface GenerationRule extends EvidenceTrace {
  id: string;
  type: string;
  description: string;
}

export interface CategoryBlueprint {
  seed: string;
  sourceSignatureVersion: string;
  identityProfile: string;
  dominantPatternClusters: PatternCluster[];
  compatibleCombinations: PatternCluster[];
  incompatibleCombinations: PatternCluster[];
  preferredStructures: GenerationRule[];
  preferredPhoneticFlows: GenerationRule[];
  preferredMorphology: GenerationRule[];
  preferredTransitions: GenerationRule[];
  generationConstraints: GenerationRule[];
  generationRecommendations: GenerationRule[];
  confidence: number;
  generatedAt: string;
  metadata: Record<string, any>;
}

export interface BlueprintFragment {
  type: "cluster" | "relationship" | "structure" | "flow" | "morphology" | "transition" | "constraint" | "recommendation";
  data: any;
  trace: SignaturePattern[];
}

export interface BlueprintAnalyzer {
  id: string;
  name: string;
  analyze(signature: CategorySignature): BlueprintFragment[];
}
