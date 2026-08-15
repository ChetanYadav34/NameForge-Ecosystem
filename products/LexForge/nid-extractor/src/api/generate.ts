import { assembleCandidates } from '../generation/candidate_assembler';
import { GenerationRequest, Candidate } from '../generation/types';
import { AvailabilityService } from '../availability/availability_service';
import { SCORING_WEIGHTS } from '../generation/human_shortlist_optimizer';

// Simulate an Access Policy or billing layer
function isUserPaid(userId: string): boolean {
    return userId === 'paid_user';
}

export async function generateNamesEndpoint(
    req: GenerationRequest, 
    availabilityService: AvailabilityService,
    userId: string = 'free_user'
): Promise<any> {
    
    // 1. Core Generation Pipeline
    let candidates = assembleCandidates(req);

    // 2. Capability Boundary (FREE vs PAID)
    const paidTier = isUserPaid(userId);
    const shouldCheckAvailability = paidTier && req.availabilityCheck;

    if (!shouldCheckAvailability) {
        // FREE or opted-out: Map to NOT_CHECKED contract
        const results = candidates.map(c => ({
            name: c.candidateString,
            strategySource: c.strategySource || 'unknown',
            scores: {
                generationComposite: c.compositeScore,
                brandability: c.scoreComponents.structuralSuccess,
                availabilityRisk: 0.0 // Ignored if not checked
            },
            availability: {
                companyConflict: { status: 'NOT_CHECKED' },
                trademark: { status: 'NOT_CHECKED' },
                domains: {
                    com: { status: 'NOT_CHECKED' },
                    io: { status: 'NOT_CHECKED' },
                    ai: { status: 'NOT_CHECKED' },
                    co: { status: 'NOT_CHECKED' }
                }
            }
        }));

        return { candidates: results };
    }

    // PAID: Run availability service
    // To respect rate limits and latency, we could batch or parallelize.
    // For this POC, we process top 50 in parallel chunks.
    const topCandidates = candidates.slice(0, 50);
    
    const enrichedPromises = topCandidates.map(async c => {
        const avail = await availabilityService.checkAvailability(c.candidateString, {
            domains: ['com', 'io', 'ai', 'co'],
            checkTrademarks: true
        });

        // Re-rank based on availability risk using the configured weight (Adjustment #1 & #2)
        const RISK_WEIGHT = SCORING_WEIGHTS.availability; // 0.15
        const newScore = c.compositeScore - (RISK_WEIGHT * avail.overallAvailabilityRisk);

        return {
            name: c.candidateString,
            strategySource: c.strategySource || 'unknown',
            scores: {
                generationComposite: newScore,
                brandability: c.scoreComponents.structuralSuccess,
                humanShortlistScore: c.humanShortlistScore ? c.humanShortlistScore.finalScore : c.compositeScore * 100,
                availabilityRisk: avail.overallAvailabilityRisk,
                mutationQuality: c.scoreComponents.mutationQuality,
                originalScore: c.compositeScore
            },
            mutationHistory: c.mutationHistory || [],
            availability: {
                companyConflict: avail.company,
                trademark: avail.trademark,
                domains: avail.domain
            }
        };
    });

    const enriched = await Promise.all(enrichedPromises);
    
    // Re-sort after applying risk penalty
    enriched.sort((a, b) => b.scores.generationComposite - a.scores.generationComposite);

    return { candidates: enriched };
}
