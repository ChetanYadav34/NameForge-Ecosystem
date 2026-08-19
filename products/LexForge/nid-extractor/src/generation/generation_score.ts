export type Database = any;
import { CandidateScoreComponent } from './types';

export function calculateCompositeScore(components: CandidateScoreComponent): number {
    return (
        (components.semanticRelevance * 0.15) +
        (components.industryAffinity * 0.10) +
        (components.intentAlignment * 0.10) +
        (components.strategyAlignment * 0.10) +
        (components.pmiCompatibility * 0.10) +
        (components.novelty * 0.15) +
        (components.trendVelocity * 0.05) +
        (components.structuralSuccess * 0.10) +
        (components.semanticPreservation * 0.05) +
        (components.mutationQuality * 0.05) +
        (components.conceptualDistinctiveness * 0.05)
    );
}

export async function persistCandidateScore(requestId: string, candidateString: string, comps: CandidateScoreComponent, composite: number, db: Database) {
    const insertScore = db.prepare(`
        INSERT INTO generation_scores (
            request_id, candidate_string, semantic_relevance, industry_affinity, 
            pmi_compatibility, novelty, trend_velocity, structural_success, composite_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await insertScore.bind(
        requestId,
        candidateString,
        comps.semanticRelevance,
        comps.industryAffinity,
        comps.pmiCompatibility,
        comps.novelty,
        comps.trendVelocity,
        comps.structuralSuccess,
        composite
    ).run();
}

export async function persistDebugLog(requestId: string, level: string, stepName: string, details: string, db: Database) {
    await db.prepare(`INSERT INTO generation_debug_log (request_id, log_level, step_name, details) VALUES (?, ?, ?, ?)`).bind(requestId, level, stepName, details).run();
}
