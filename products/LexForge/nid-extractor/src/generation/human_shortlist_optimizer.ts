import { AestheticScores, scoreAesthetics } from './aesthetic_scoring';
import { detectClunkiness, ClunkinessResult } from './clunkiness_detector';
import { CandidateScoreComponent } from './types';

export interface HumanShortlistEvaluation {
    isVetoed: boolean;
    vetoReasons: string[];
    aestheticTotal: number;
    semanticRelevance: number;
    clunkinessPenalty: number;
    finalScore: number;
}

// Configurable Scoring Weights (Adjustment #1)
export const SCORING_WEIGHTS = {
    shortlist: 0.60,
    semantic: 0.25,
    availability: 0.15 // Will be applied in the API layer / late stage
};

export function optimizeHumanShortlist(
    name: string,
    scoreComponents: Partial<CandidateScoreComponent>
): HumanShortlistEvaluation {
    // 1. Clunkiness Veto / Penalty
    const clunkiness = detectClunkiness(name);
    
    // 2. Aesthetic Scoring
    const aesthetics = scoreAesthetics(name);
    
    // 3. Semantic Relevance (from existing pipeline)
    // Semantic score is typically around 0.4-0.6 in raw m1.score. 
    // We normalize it: starting at a baseline of 60 to prevent tanking the aesthetic score.
    const rawSemantic = scoreComponents.semanticRelevance || 0;
    const semanticScore = 60 + Math.min(40, rawSemantic * 100);
    
    // 4. Calculate pre-availability Score (Using 60/25/15 weights, but normalized out of 85% for now since availability is applied later)
    // Wait, the score here should just combine aesthetic and semantic. 
    // We can compute the "Base Score" and return it.
    
    let finalScore = 0;
    
    if (!clunkiness.isVetoed) {
        // Base components
        const weightedAesthetic = aesthetics.aestheticTotal * (SCORING_WEIGHTS.shortlist / (SCORING_WEIGHTS.shortlist + SCORING_WEIGHTS.semantic));
        const weightedSemantic = semanticScore * (SCORING_WEIGHTS.semantic / (SCORING_WEIGHTS.shortlist + SCORING_WEIGHTS.semantic));
        
        const prePenaltyScore = weightedAesthetic + weightedSemantic;
        
        // Apply continuous clunkiness penalty
        finalScore = prePenaltyScore * clunkiness.penaltyScore;
    }

    return {
        isVetoed: clunkiness.isVetoed,
        vetoReasons: clunkiness.flags,
        aestheticTotal: aesthetics.aestheticTotal,
        semanticRelevance: semanticScore,
        clunkinessPenalty: clunkiness.penaltyScore,
        finalScore: Math.max(0, Math.min(100, finalScore))
    };
}
