import { routeArchetype } from '../generation/archetype_router';
import { assembleCandidates } from '../generation/candidate_assembler';
import { calculateCompositeScore } from '../generation/generation_score';
import { GenerationRequest } from '../generation/types';
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');

describe('Phase 4.1: Generation Intelligence Core', () => {
    
    // We assume the DB is seeded and valid from Phase 3.8 and Phase 4 schemas
    
    test('calculateCompositeScore applies correct weights', () => {
        const comps = {
            semanticRelevance: 1.0,
            industryAffinity: 1.0,
            intentAlignment: 1.0,
            strategyAlignment: 1.0,
            pmiCompatibility: 1.0,
            novelty: 0.5,
            trendVelocity: 0.5,
            structuralSuccess: 1.0,
            semanticPreservation: 1.0,
            mutationQuality: 1.0,
            conceptualDistinctiveness: 1.0
        };
        const score = calculateCompositeScore(comps);
        // (1*0.15)+(1*0.10)+(1*0.10)+(1*0.10)+(1*0.10)+(0.5*0.15)+(0.5*0.05)+(1*0.10)+(1*0.05)+(1*0.05)+(1*0.05)
        // 0.15 + 0.10 + 0.10 + 0.10 + 0.10 + 0.075 + 0.025 + 0.10 + 0.05 + 0.05 + 0.05 = 0.90
        expect(score).toBeCloseTo(0.90);
    });

    test('routeArchetype resolves industry and applies style boosts', () => {
        const req: GenerationRequest = {
            requestId: 'test-1',
            prompt: 'Build a fintech app',
            industry: 'Fintech',
            styleReferences: ['stripe-like']
        };
        
        const archetypes = routeArchetype(req);
        expect(archetypes.length).toBeGreaterThan(0);
        
        // Since Stripe-like boosts "Dictionary / Semantic", it should rank high
        const dictArch = archetypes.find(a => a.archetype === 'Dictionary / Semantic');
        expect(dictArch).toBeDefined();
        
        // Fintech maps to canonical Financial Services which has Dictionary / Semantic seeded at 0.8 confidence
        // With +0.2 boost, it should be 1.0
        expect(dictArch?.confidence).toBeCloseTo(1.0);
    });

    test('assembleCandidates generates diverse candidate structures', () => {
        const req: GenerationRequest = {
            requestId: 'test-2',
            prompt: 'Build a social network',
            industry: 'Social',
            styleReferences: []
        };
        
        const candidates = assembleCandidates(req);
        
        // Expect 100 raw candidates per request (or close to it if deduplicated)
        expect(candidates.length).toBeGreaterThan(50);
        
        // Check for structural diversity
        const archetypesUsed = new Set(candidates.map(c => c.archetype));
        expect(archetypesUsed.size).toBeGreaterThan(1);
    });
});
