import Database from 'better-sqlite3';
import path from 'path';
import { GenerationRequest, ArchetypeScore, Candidate, CandidateScoreComponent, NamingStrategy } from './types';
import { routeArchetype } from './archetype_router';
import { calculateCompositeScore, persistCandidateScore, persistDebugLog } from './generation_score';
import { validateCandidate } from './candidate_validator';
import { analyzePhonotactics } from './phonotactic_engine';
import { scoreBrandability } from './brandability_score';
import { resolveNamingStrategy } from './naming_strategy';
import { extractIntentConcepts } from './intent_extractor';
import { MutationEngine } from './mutation_engine';
import { optimizeHumanShortlist } from './human_shortlist_optimizer';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
let dbInstance: Database.Database | null = null;

function getDB() {
    if (!dbInstance) {
        dbInstance = new Database(DB_PATH);
    }
    return dbInstance;
}

function resolveIndustryId(industry: string): number {
    const db = getDB();
    const row = db.prepare(`
        SELECT canonical_id FROM industry_alias WHERE alias_name = ? COLLATE NOCASE
        UNION
        SELECT id FROM industry_ontology WHERE canonical_name = ? COLLATE NOCASE
    `).get(industry, industry) as any;
    
    return row ? (row.canonical_id || row.id) : 1; 
}

export function assembleCandidates(req: GenerationRequest): Candidate[] {
    const db = getDB();
    const strategy = resolveNamingStrategy(req);
    
    // Add strategy to request for downstream tools (if not explicitly set)
    req.strategy = strategy;
    
    const indId = resolveIndustryId(req.industry);
    persistDebugLog(req.requestId, 'INFO', 'ROUTING', `Strategy: ${strategy}. Industry: ${req.industry} (ID ${indId}).`);

    const rankedArchetypes = routeArchetype(req);
    const mutationEngine = new MutationEngine(db);

    // Concept Retrieval based on Strategy
    let concepts = new Map<number, { id: number, name: string, score: number, source: 'industry' | 'intent' | 'hybrid' }>();

    if (strategy === 'industry' || strategy === 'hybrid') {
        const indConcepts = db.prepare(`
            SELECT c.id, c.canonical_name, cim.affinity_score
            FROM concept_industry_map cim
            JOIN concept_catalog c ON c.id = cim.concept_id
            WHERE cim.industry_id = ?
            ORDER BY cim.affinity_score DESC
            LIMIT 20
        `).all(indId) as any[];
        
        for (const ic of indConcepts) {
            concepts.set(ic.id, { id: ic.id, name: ic.canonical_name, score: ic.affinity_score, source: 'industry' });
        }
    }

    if ((strategy === 'intent' || strategy === 'hybrid') && req.intent && req.intent.length > 0) {
        const extracted = extractIntentConcepts(req.intent, req.industry, db);
        for (const ec of extracted) {
            if (concepts.has(ec.conceptId)) {
                // Bridge found
                const existing = concepts.get(ec.conceptId)!;
                existing.source = 'hybrid';
                existing.score = Math.max(existing.score, ec.abstractnessScore);
            } else {
                concepts.set(ec.conceptId, { id: ec.conceptId, name: ec.canonicalName, score: ec.abstractnessScore, source: 'intent' });
            }
        }
    }

    // Fallback
    if (concepts.size === 0) {
        const fallbacks = db.prepare(`SELECT id, canonical_name, 1.0 as affinity_score FROM concept_catalog ORDER BY global_frequency DESC LIMIT 20`).all() as any[];
        for (const fb of fallbacks) {
            concepts.set(fb.id, { id: fb.id, name: fb.canonical_name, score: 0.5, source: 'industry' });
        }
    }

    // Retrieve Morphemes
    const morphemePool = new Map<number, { morpheme: string, score: number, source: 'industry' | 'intent' | 'hybrid' }>();
    
    for (const c of concepts.values()) {
        const morphemes = db.prepare(`
            SELECT m.id, m.morpheme, m.detected_type, cmm.semantic_relevance 
            FROM concept_morpheme_map cmm
            JOIN morpheme_catalog m ON m.id = cmm.morpheme_id
            WHERE cmm.concept_id = ?
            ORDER BY cmm.semantic_relevance DESC
            LIMIT 15
        `).all(c.id) as any[];
        
        for (const m of morphemes) {
            if (!morphemePool.has(m.id)) {
                morphemePool.set(m.id, { morpheme: m.morpheme, score: m.semantic_relevance, source: c.source });
            } else if (morphemePool.get(m.id)!.source !== c.source) {
                morphemePool.get(m.id)!.source = 'hybrid';
            }
        }
    }

    const candidates: Candidate[] = [];
    const mKeys = Array.from(morphemePool.keys());
    if (mKeys.length === 0) return [];

    const quotas = [
        { arch: rankedArchetypes[0], limit: 50 },
        { arch: rankedArchetypes[1] || rankedArchetypes[0], limit: 30 },
        { arch: rankedArchetypes[2] || rankedArchetypes[0], limit: 20 }
    ];

    let totalIterations = 0;

    for (const quota of quotas) {
        let generatedForQuota = 0;
        let iterations = 0;
        
        while (generatedForQuota < quota.limit && iterations < 3000) {
            iterations++;
            totalIterations++;
            
            const selectedArch = quota.arch;
            let rawStr = '';
            let usedMorphemes: number[] = [];
            let pmiScore = 0.5;
            
            const m1Id = mKeys[Math.floor(Math.random() * mKeys.length)];
            const m1 = morphemePool.get(m1Id)!;
            
            if (selectedArch.archetype === 'Dictionary / Semantic') {
                rawStr = m1.morpheme;
                usedMorphemes = [m1Id];
            } else if (selectedArch.archetype === 'Abstract Coined') {
                rawStr = m1.morpheme.substring(0, 4) + 'io';
                usedMorphemes = [m1Id];
            } else if (selectedArch.archetype === 'Root + Suffix') {
                const suffixes = ['ify', 'ly', 'io', 'base', 'er', 'a', 'ex', 'up', 'hub', 'os', 'flow', 'scale', 'ai', 'tech', 'node', 'zen'];
                const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
                rawStr = m1.morpheme + suffix;
                usedMorphemes = [m1Id];
            } else if (selectedArch.archetype === 'Portmanteau') {
                const m2Id = mKeys[Math.floor(Math.random() * mKeys.length)];
                const m2 = morphemePool.get(m2Id)!;
                
                const pmiCheck = db.prepare(`SELECT pmi_score FROM morpheme_cooccurrence WHERE morpheme_a_id = ? AND morpheme_b_id = ?`).get(m1Id, m2Id) as any;
                if (pmiCheck) pmiScore = pmiCheck.pmi_score;
                else pmiScore = 0.2;
                
                const blend1 = m1.morpheme.substring(0, Math.ceil(m1.morpheme.length / 2));
                const blend2 = m2.morpheme.substring(Math.floor(m2.morpheme.length / 2));
                rawStr = blend1 + blend2;
                usedMorphemes = [m1Id, m2Id];
            } else {
                rawStr = m1.morpheme;
                usedMorphemes = [m1Id];
            }
            
            rawStr = rawStr.charAt(0).toUpperCase() + rawStr.slice(1).toLowerCase();
            if (candidates.some(c => c.candidateString === rawStr)) continue;

            // Phase 4.2A Validation
            const valResult = validateCandidate(req.requestId, rawStr);
            if (!valResult.isValid) continue;

            // Phase 4.5A: Mutation Engine Disabled for Baseline Audit
            let finalStr = rawStr;
            let mutationQuality = 1.0;
            let semanticPreservation = 1.0;
            let history: string[] = [];
            
            const finalPhono = analyzePhonotactics(req.requestId, finalStr);
            const finalBrand = scoreBrandability(req.requestId, finalStr, valResult, finalPhono);

            // Phase 4.5 Phonotactics Guardrail: Drop if it fails strict pronounceability check
            if (finalBrand.brandabilityScore === 0) continue;

            // Determine strategy source of candidate
            const srcSet = new Set(usedMorphemes.map(id => morphemePool.get(id)!.source));
            let candStrategy: 'industry' | 'intent' | 'hybrid' = 'hybrid';
            if (srcSet.has('industry') && !srcSet.has('intent')) candStrategy = 'industry';
            else if (srcSet.has('intent') && !srcSet.has('industry')) candStrategy = 'intent';
            
            // Alignment scores
            const strategyAlignment = (strategy === candStrategy || candStrategy === 'hybrid') ? 1.0 : 0.5;
            const intentAlignment = (candStrategy === 'intent' || candStrategy === 'hybrid') ? 0.9 : 0.4;
            
            // Compute distinctiveness: High distinctiveness if intent-led or abstracted away from literal industry
            const conceptualDistinctiveness = candStrategy === 'industry' ? 0.5 : (candStrategy === 'hybrid' ? 0.8 : 1.0);

            const comps: CandidateScoreComponent = {
                semanticRelevance: m1.score,
                industryAffinity: candStrategy === 'industry' ? 0.9 : 0.4,
                intentAlignment,
                strategyAlignment,
                pmiCompatibility: pmiScore,
                novelty: 1.0, // Mutation is off
                trendVelocity: Math.random() * 0.5 + 0.5,
                structuralSuccess: finalBrand.brandabilityScore / 100,
                semanticPreservation,
                mutationQuality,
                conceptualDistinctiveness
            };
            
            // Phase 4.5: Human Shortlist Optimizer takes over as primary ranking signal
            const optimizeResult = optimizeHumanShortlist(finalStr, comps);
            if (optimizeResult.isVetoed) continue; // Clunkiness detector veto

            const cScore = optimizeResult.finalScore / 100; // Normalize back to 0-1 for internal composite tracking
            
            candidates.push({
                candidateString: finalStr,
                archetype: selectedArch.archetype,
                concepts: [],
                morphemes: usedMorphemes,
                strategySource: candStrategy,
                mutationHistory: history,
                scoreComponents: comps,
                compositeScore: cScore,
                // keep these internal
                phonotacticResult: finalPhono,
                brandabilityResult: finalBrand,
                humanShortlistScore: optimizeResult
            } as any);
            
            generatedForQuota++;
        }
    }
    
    let finalCandidates: Candidate[] = [...candidates];
        
    // 4.5B CONDITIONAL MUTATION: Only mutate if HSS(mutated) > HSS(parent)
    const engine = new MutationEngine(getDB());
    for (const c of candidates) {
        const hssParent = calculateHSS(c);
        
        // Try up to 2 mutations
        for (let i = 0; i < 2; i++) {
            const mutResult = engine.mutateCandidate(c.candidateString, c.candidateString);
            if (mutResult.success && mutResult.mutatedString !== c.candidateString) {
                // Assemble a mock candidate to score it
                const mutatedCandidate: Candidate = {
                    ...c,
                    candidateString: mutResult.mutatedString,
                    mutationHistory: mutResult.mutationHistory
                };
                
                const hssMutated = calculateHSS(mutatedCandidate);
                if (hssMutated > hssParent) {
                    // Mutated version is aesthetically better!
                    mutatedCandidate.scoreComponents.mutationQuality = 1.2; // Bonus
                    finalCandidates.push(mutatedCandidate);
                }
            }
        }
    }
    
    // Final deduplication and ranking
    finalCandidates = finalCandidates.filter((v, i, a) => a.findIndex(t => t.candidateString === v.candidateString) === i);
    
    for (const c of finalCandidates) {
        const result = calculateHSS(c);
        c.humanShortlistScore = result;
        c.compositeScore = result.finalScore / 100; // Normalize back to 0-1 for pipeline compatibility
    }
    
    finalCandidates.sort((a, b) => b.compositeScore - a.compositeScore);
    
    // Apply strict morphological diversity filter to prevent suffix/root dominance
    const suffixCounts = new Map<string, number>();
    const rootCounts = new Map<string, number>();
    const knownSuffixes = ['ify', 'ly', 'io', 'base', 'er', 'a', 'ex', 'up', 'hub', 'os', 'flow', 'scale', 'ai', 'tech', 'node', 'zen'];
    
    const diverseCandidates: Candidate[] = [];
    
    for (const c of finalCandidates) {
        const lowerName = c.candidateString.toLowerCase();
        let foundSuffix = '';
        
        for (const suf of knownSuffixes) {
            if (lowerName.endsWith(suf)) {
                foundSuffix = suf;
                break;
            }
        }
        
        // If no known suffix, use last 2 chars as heuristic for similar endings
        if (!foundSuffix && lowerName.length > 2) {
            foundSuffix = lowerName.slice(-2);
        }
        
        let isDuplicate = false;

        // Enforce max 1 occurrence per suffix ending pattern
        if (foundSuffix) {
            if (suffixCounts.has(foundSuffix)) {
                isDuplicate = true;
            }
        }

        // Enforce max 1 occurrence per root morpheme (or 2 if we are running low on roots)
        if (c.morphemes.length > 0) {
            const rootId = c.morphemes[0].toString();
            const rCount = rootCounts.get(rootId) || 0;
            // Allow up to 2 of the same root IF they have different suffixes, otherwise it restricts too much
            if (rCount >= 2) {
                isDuplicate = true;
            }
        }

        if (!isDuplicate) {
            if (foundSuffix) suffixCounts.set(foundSuffix, 1);
            if (c.morphemes.length > 0) {
                const rootId = c.morphemes[0].toString();
                rootCounts.set(rootId, (rootCounts.get(rootId) || 0) + 1);
            }
            diverseCandidates.push(c);
        }
    }
    
    finalCandidates = diverseCandidates;
    
    const uniqueCandidates: Candidate[] = finalCandidates;

    persistDebugLog(req.requestId, 'INFO', 'ASSEMBLY_COMPLETE', `Generated ${uniqueCandidates.length} unique candidates.`);
    
    // We shouldn't drop the generation_scores table insertions, but the schema needs updating if we add new columns, 
    // for now we'll just skip inserting new columns into sqlite generation_scores table to avoid schema issues,
    // or just insert the old columns.
    const persistDb = new Database(DB_PATH);
    const insertScore = persistDb.prepare(`
        INSERT INTO generation_scores (
            request_id, candidate_string, semantic_relevance, industry_affinity, 
            pmi_compatibility, novelty, trend_velocity, structural_success, composite_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    persistDb.transaction(() => {
        for (const c of uniqueCandidates) {
            try {
                insertScore.run(
                    req.requestId,
                    c.candidateString,
                    c.scoreComponents.semanticRelevance,
                    c.scoreComponents.industryAffinity,
                    c.scoreComponents.pmiCompatibility,
                    c.scoreComponents.novelty,
                    c.scoreComponents.trendVelocity,
                    c.scoreComponents.structuralSuccess,
                    c.compositeScore
                );
            } catch(e) {
                // duplicate insertion ignore
            }
        }
    })();
    persistDb.close();

    return uniqueCandidates;
}

function calculateHSS(c: Candidate) {
    // Basic wrapper to get the score
    return optimizeHumanShortlist(c.candidateString, c.scoreComponents);
}
