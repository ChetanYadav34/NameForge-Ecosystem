import { LexEntry } from "@/lib/dataset/types";

// ============================================================================
// Core Research Session & Artifacts
// ============================================================================

export interface ResearchSession {
  id: string;
  seed: string;
  version: string;
  startedAt: string;
  finishedAt?: string;
  providersExecuted: string[];
  passesExecuted: string[];
  executionMetrics: Record<string, any>;
  statistics: Record<string, number>;
  warnings: string[];
  errors: string[];
}

export interface CategoryKnowledge {
  seed: string;
  researchSession: ResearchSession;
  candidatePool: CandidateTerm[];
  acceptedVocabulary: CandidateTerm[];
  rejectedVocabulary: CandidateTerm[];
  vocabularyGraph: VocabularyGraph;
  featureProfiles: {
    phonetics?: PhoneticProfile;
    morphology?: MorphologyProfile;
    orthography?: OrthographyProfile;
    frequency?: FrequencyProfile;
    semantics?: SemanticProfile;
  };
  providerSummary: string[];
  statistics: Record<string, number>;
  metadata: Record<string, any>;
  executionTime: number;
  version: string;
}

// ============================================================================
// Discovery & Evidence Models
// ============================================================================

export interface EvidenceRecord {
  id: string;
  provider: string;
  providerVersion: string;
  source: string;
  relation: string;
  strength: number;
  confidence: number;
  discoveredFrom: string;
  distanceFromSeed: number;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface ConfidenceBreakdown {
  rulesApplied: Record<string, number>;
  overallScore: number;
}

export interface CandidateTerm {
  lexEntry?: LexEntry; // Populated later in pipeline
  term: string; // The raw word
  evidence: EvidenceRecord[];
  confidenceBreakdown: ConfidenceBreakdown;
  overallConfidence: number;
  rankingScore: number;
  providerSummary: string[];
  status: "pending" | "accepted" | "rejected";
  metadata: Record<string, any>;
}

// ============================================================================
// Vocabulary Graph
// ============================================================================

export interface VocabularyNode {
  term: string;
  lexEntry: LexEntry;
  confidence: number;
  ranking: number;
  evidence: EvidenceRecord[];
  providerSummary: string[];
  metadata: Record<string, any>;
}

export interface VocabularyEdge {
  source: string;
  target: string;
  relationship: string;
  weight: number;
}

export interface VocabularyGraph {
  concept: string;
  nodes: Map<string, VocabularyNode>;
  edges: VocabularyEdge[];
  
  addNode(node: VocabularyNode): void;
  addEdge(edge: VocabularyEdge): void;
  getWords(): string[];
  getEntries(): LexEntry[];
  getNode(term: string): VocabularyNode | undefined;
}

// ============================================================================
// Providers
// ============================================================================

export interface DiscoveryProvider {
  id: string;
  name: string;
  version: string;
  priority: number;
  discover(seed: string): Promise<EvidenceRecord[]>;
}

// ============================================================================
// Confidence Engine
// ============================================================================

export interface ConfidenceRule {
  id: string;
  name: string;
  evaluate(candidate: CandidateTerm): number; // Returns a score modifier (0.0 to 1.0)
}

// ============================================================================
// Selection Policy
// ============================================================================

export interface SelectionPolicy {
  minimumConfidence: number;
  minimumRanking?: number;
  requiredProviders?: string[];
}

// ============================================================================
// Feature Profiles (Existing)
// ============================================================================

export interface PhoneticProfile {
  phonemeInventory: Record<string, number>;
  syllableInventory: Record<string, number>;
  onsetClusters: Record<string, number>;
  codaClusters: Record<string, number>;
  soundTransitionFrequencies: Record<string, number>;
}

export interface MorphologyProfile {
  morphologicalRoots: Array<{ root: string; frequency: number }>;
  commonPrefixes: Array<{ affix: string; frequency: number }>;
  commonSuffixes: Array<{ affix: string; frequency: number }>;
  commonInfixes: Array<{ affix: string; frequency: number }>;
}

export interface OrthographyProfile {
  characterNgrams: Record<string, number>;
  letterFrequency: Record<string, number>;
}

export interface FrequencyProfile {
  averageZipf: number;
  medianZipf: number;
  distribution: Record<string, number>;
}

export interface SemanticProfile {
  taxonomyDistribution: Record<string, number>;
  commonHypernyms: Array<{ term: string; frequency: number }>;
}

// ============================================================================
// Feature Extractors
// ============================================================================

export interface FeatureExtractor<TProfile> {
  id: string;
  name: string;
  extract(graph: VocabularyGraph): TProfile;
}

// ============================================================================
// Research Passes
// ============================================================================

export interface ResearchContext {
  session: ResearchSession;
  seed: string;
  
  // Pipeline State
  discoveredEvidence: EvidenceRecord[];
  candidatePool: Map<string, CandidateTerm>;
  acceptedVocabulary: CandidateTerm[];
  rejectedVocabulary: CandidateTerm[];
  
  graph?: VocabularyGraph;
  
  profiles: {
    phonetics?: PhoneticProfile;
    morphology?: MorphologyProfile;
    orthography?: OrthographyProfile;
    frequency?: FrequencyProfile;
    semantics?: SemanticProfile;
  };
  
  categoryKnowledge?: CategoryKnowledge;
}

export interface ResearchPass {
  id: string;
  name: string;
  priority: number;
  execute(context: ResearchContext): Promise<void>;
}
