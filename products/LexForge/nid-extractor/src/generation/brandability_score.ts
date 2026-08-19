export type Database = any;

import { ValidationResult } from './candidate_validator';
import { PhonotacticResult } from './phonotactic_engine';






export interface BrandabilityResult {
    brandabilityScore: number;
    components: {
        pronounceability: number;
        lengthFitness: number;
        memorability: number;
        visualSimplicity: number;
        structuralHarmony: number;
        brandSimilarityPenalty: number;
    }
}

export async function scoreBrandability(requestId: string, candidate: string, validation: ValidationResult, phonotactics: PhonotacticResult): BrandabilityResult {
    // Phase 4.5 Refactor: Phonotactics is now a guardrail.
    const pronounceability = phonotactics.pronounceabilityScore;
    
    // If it's completely unpronounceable, brandability fails. Otherwise, it's just a structural component.
    const structuralHarmony = validation.validationScore;
    const isUnspeakable = pronounceability < 0.2;
    
    // Visual simplicity is high if shape is clean
    const visualSimplicity = phonotactics.issues.length === 0 ? 1.0 : 0.5;

    // Calculate a base score just for historical persistence, but this no longer drives ranking.
    let composite = isUnspeakable ? 0 : ((pronounceability * 0.5) + (structuralHarmony * 0.3) + (visualSimplicity * 0.2));
    const finalScore = composite * 100;

    // Skip persisting to DB during generation loop to avoid Cloudflare D1 subrequest limits (max 50/request)
    // and daily write limits. We only persist the final winners.

    return {
        brandabilityScore: finalScore,
        components: {
            pronounceability,
            lengthFitness: 1.0,
            memorability: 1.0,
            visualSimplicity,
            structuralHarmony,
            brandSimilarityPenalty: 0
        }
    };
}
