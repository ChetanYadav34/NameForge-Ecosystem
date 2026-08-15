import Database from 'better-sqlite3';
import path from 'path';
import { CandidateScoreComponent } from './types';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
let dbInstance: Database.Database | null = null;

function getDB() {
    if (!dbInstance) {
        dbInstance = new Database(DB_PATH);
    }
    return dbInstance;
}

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

export function persistCandidateScore(requestId: string, candidateString: string, comps: CandidateScoreComponent, composite: number) {
    const db = getDB();
    const insertScore = db.prepare(`
        INSERT INTO generation_scores (
            request_id, candidate_string, semantic_relevance, industry_affinity, 
            pmi_compatibility, novelty, trend_velocity, structural_success, composite_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertScore.run(
        requestId,
        candidateString,
        comps.semanticRelevance,
        comps.industryAffinity,
        comps.pmiCompatibility,
        comps.novelty,
        comps.trendVelocity,
        comps.structuralSuccess,
        composite
    );
}

export function persistDebugLog(requestId: string, level: string, stepName: string, details: string) {
    const db = getDB();
    db.prepare(`INSERT INTO generation_debug_log (request_id, log_level, step_name, details) VALUES (?, ?, ?, ?)`).run(requestId, level, stepName, details);
}
