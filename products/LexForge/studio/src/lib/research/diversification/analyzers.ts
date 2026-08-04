import { DiversificationContext, RankedCandidate, SimilarityAnalyzer } from "./types";

// Note: For a real implementation, you'd use a distance calculation like Levenshtein.
// Here we mock the structural similarity.
function calculateLevenshtein(a: string, b: string): number {
  if (a === b) return 1.0;
  // Mock logic: 
  return 0.5; // Neutral
}

export class OrthographicSimilarityAnalyzer implements SimilarityAnalyzer {
  id = "analyzer:orthographic_similarity";
  name = "Orthographic Similarity Analyzer";

  calculateSimilarity(c1: RankedCandidate, c2: RankedCandidate, context: DiversificationContext): number {
    return calculateLevenshtein(c1.filteredCandidate.evaluatedCandidate.candidate.value, c2.filteredCandidate.evaluatedCandidate.candidate.value);
  }
}

export class PhoneticSimilarityAnalyzer implements SimilarityAnalyzer {
  id = "analyzer:phonetic_similarity";
  name = "Phonetic Similarity Analyzer";

  calculateSimilarity(c1: RankedCandidate, c2: RankedCandidate, context: DiversificationContext): number {
    return 0.5; // Mock
  }
}

export class MorphologicalSimilarityAnalyzer implements SimilarityAnalyzer {
  id = "analyzer:morphological_similarity";
  name = "Morphological Similarity Analyzer";

  calculateSimilarity(c1: RankedCandidate, c2: RankedCandidate, context: DiversificationContext): number {
    return 0.5; // Mock
  }
}

export class StructuralSimilarityAnalyzer implements SimilarityAnalyzer {
  id = "analyzer:structural_similarity";
  name = "Structural Similarity Analyzer";

  calculateSimilarity(c1: RankedCandidate, c2: RankedCandidate, context: DiversificationContext): number {
    return 0.5; // Mock
  }
}

export class TransitionSimilarityAnalyzer implements SimilarityAnalyzer {
  id = "analyzer:transition_similarity";
  name = "Transition Similarity Analyzer";

  calculateSimilarity(c1: RankedCandidate, c2: RankedCandidate, context: DiversificationContext): number {
    return 0.5; // Mock
  }
}

export class ClusterSimilarityAnalyzer implements SimilarityAnalyzer {
  id = "analyzer:cluster_similarity";
  name = "Cluster Similarity Analyzer";

  calculateSimilarity(c1: RankedCandidate, c2: RankedCandidate, context: DiversificationContext): number {
    return 0.5; // Mock
  }
}
