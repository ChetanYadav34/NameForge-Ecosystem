import { GenerationContext } from '../context/GenerationContext';
import { SemanticClusterRoot } from '../../server/SemanticClusterService';

export interface CandidateProvenance {
  strategyName: string;
  sourceRoots: SemanticClusterRoot[];
  rulesApplied: string[];
}

export interface CandidateScore {
  semanticScore: number;
  phoneticScore: number;
  industryScore: number;
  totalScore: number; // The ConfidenceScore
}

export interface CandidateWord {
  word: string;
  provenance: CandidateProvenance;
  score?: CandidateScore;
}

export interface IGenerationStrategy {
  name: string;
  weight: number;
  generate(context: GenerationContext, cluster: SemanticClusterRoot[], limit: number): Promise<CandidateWord[]>;
}
