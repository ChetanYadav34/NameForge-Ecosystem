export type Database = any;
import { GenerationRequest, ArchetypeScore, Candidate, CandidateScoreComponent, NamingStrategy } from './types';
import { routeArchetype } from './archetype_router';
import { calculateCompositeScore, persistCandidateScore, persistDebugLog } from './generation_score';
import cmmFallbackData from '../data/cmm_fallback.json';
import { validateCandidate } from './candidate_validator';
import { analyzePhonotactics } from './phonotactic_engine';
import { scoreBrandability } from './brandability_score';
import { resolveNamingStrategy } from './naming_strategy';
import { extractIntentConcepts } from './intent_extractor';
import { MutationEngine } from './mutation_engine';
import { optimizeHumanShortlist } from './human_shortlist_optimizer';

async function resolveIndustryId(industry: string, db: Database): Promise<number> {
    const row = await db.prepare(`
        SELECT canonical_id FROM industry_alias WHERE alias_name = ? COLLATE NOCASE
        UNION
        SELECT id FROM industry_ontology WHERE canonical_name = ? COLLATE NOCASE
    `).bind(industry, industry).first() as any;
    
    return row ? (row.canonical_id || row.id) : 1; 
}

export async function assembleCandidates(req: GenerationRequest, db: Database): Promise<Candidate[]> {
    const strategy = resolveNamingStrategy(req);
    const mutator = await MutationEngine.create(db);
    
    // Add strategy to request for downstream tools (if not explicitly set)
    req.strategy = strategy;
    
    const indId = await resolveIndustryId(req.industry, db);
    await persistDebugLog(req.requestId, 'INFO', 'ROUTING', `Strategy: ${strategy}. Industry: ${req.industry} (ID ${indId}).`, db);

    const rankedArchetypes = await routeArchetype(req, db);
    const mutationEngine = await MutationEngine.create(db);

    // Concept Retrieval based on Strategy
    let concepts = new Map<number, { id: number, name: string, score: number, source: 'industry' | 'intent' | 'hybrid' }>();
    let literalMorphemes: string[] = [];

    if (strategy === 'industry' || strategy === 'hybrid') {
        const indConcepts = (await db.prepare(`
            SELECT c.id, c.canonical_name, cim.affinity_score
            FROM concept_industry_map cim
            JOIN concept_catalog c ON c.id = cim.concept_id
            WHERE cim.industry_id = ?
            ORDER BY cim.affinity_score DESC
            LIMIT 20
        `).bind(indId).all()).results as any[];
        
        for (const ic of indConcepts) {
            concepts.set(ic.id, { id: ic.id, name: ic.canonical_name, score: ic.affinity_score, source: 'industry' });
        }
    }

    if ((strategy === 'intent' || strategy === 'hybrid') && req.intent && req.intent.length > 0) {
        const extracted = await extractIntentConcepts(req.intent, req.industry, db);
        
        // 1. Process regular matched concepts
        for (const ec of extracted.concepts) {
            if (concepts.has(ec.conceptId)) {
                // Bridge found
                const existing = concepts.get(ec.conceptId)!;
                existing.source = 'hybrid';
                existing.score = Math.max(existing.score, ec.abstractnessScore);
            } else {
                concepts.set(ec.conceptId, { id: ec.conceptId, name: ec.canonicalName, score: ec.abstractnessScore, source: 'intent' });
            }
        }
        
        // 2. Process unmatched tokens (e.g. user typed "creation", but no concept matched)
        literalMorphemes = extracted.unmatchedTokens;
    }

    // Fallback if no concepts found at all and no literal morphemes
    if (concepts.size === 0 && literalMorphemes.length === 0) {
        const fallbacks = (await db.prepare(`SELECT id, canonical_name, 1.0 as affinity_score FROM concept_catalog ORDER BY global_frequency DESC LIMIT 20`).all()).results as any[];
        for (const fb of fallbacks) {
            concepts.set(fb.id, { id: fb.id, name: fb.canonical_name, score: 0.5, source: 'industry' });
        }
    }

    // Retrieve Morphemes
    const morphemePool = new Map<number, { morpheme: string, score: number, source: 'industry' | 'intent' | 'hybrid' }>();
    
    // 1. Inject Literal Morphemes first (highest priority)
    for (const lm of literalMorphemes) {
        // Find if this exists in morpheme_catalog, or just inject it artificially
        const existing = (await db.prepare(`SELECT id, morpheme FROM morpheme_catalog WHERE morpheme = ? OR morpheme LIKE ? LIMIT 5`).bind(lm, `${lm}%`).all()).results as any[];
        if (existing.length > 0) {
            for (const ex of existing) {
                morphemePool.set(ex.id, { morpheme: ex.morpheme, score: 1.0, source: 'intent' });
            }
        } else {
            // Artificial injection (fake ID: negative to avoid collisions)
            const fakeId = -(morphemePool.size + 1);
            morphemePool.set(fakeId, { morpheme: lm, score: 1.0, source: 'intent' });
        }
    }

    // 2. Resolve Morphemes from Concepts in batches to avoid CF Worker subrequest limits
    const conceptIds = Array.from(concepts.values()).map(c => c.id);
    const morphemesByConcept = new Map<number, any[]>();
    
    if (conceptIds.length > 0) {
        const placeholders = conceptIds.map(() => '?').join(',');
        try {
            const allMorphemes = (await db.prepare(`
                SELECT cmm.concept_id, m.id, m.morpheme, m.detected_type, cmm.semantic_relevance 
                FROM concept_morpheme_map cmm
                JOIN morpheme_catalog m ON m.id = cmm.morpheme_id
                WHERE cmm.concept_id IN (${placeholders})
            `).bind(...conceptIds).all()).results as any[];
            
            for (const row of allMorphemes) {
                if (!morphemesByConcept.has(row.concept_id)) morphemesByConcept.set(row.concept_id, []);
                morphemesByConcept.get(row.concept_id)!.push(row);
            }
        } catch (e) {
            console.error("Batch morpheme query failed:", e);
        }
    }

    const missingMorphemeIds = new Set<number>();
    const fallbackLinksToProcess = [];

    for (const c of concepts.values()) {
        let morphemes = morphemesByConcept.get(c.id) || [];
        
        if (morphemes.length === 0) {
            const fallbackLinks = (cmmFallbackData as any[]).filter(r => r.concept_id === c.id);
            for (const fl of fallbackLinks) {
                missingMorphemeIds.add(fl.morpheme_id);
                fallbackLinksToProcess.push({ concept_id: c.id, morpheme_id: fl.morpheme_id, semantic_relevance: fl.semantic_relevance || 0.5 });
            }
        }
    }

    // Batch query missing morphemes from fallback data
    const mIds = Array.from(missingMorphemeIds);
    const missingMorphemesMap = new Map<number, any>();
    if (mIds.length > 0) {
        // D1 has a max of 100 bound variables, so chunk it if necessary. Usually fallbacks won't exceed this, but let's be safe.
        const chunkedMIds = mIds.slice(0, 90);
        const placeholders = chunkedMIds.map(() => '?').join(',');
        try {
            const missingRows = (await db.prepare(`SELECT id, morpheme, detected_type FROM morpheme_catalog WHERE id IN (${placeholders})`).bind(...chunkedMIds).all()).results as any[];
            for (const row of missingRows) {
                missingMorphemesMap.set(row.id, row);
            }
        } catch (e) {
            console.error("Batch missing morpheme query failed:", e);
        }
    }

    // Apply the fallbacks
    for (const fl of fallbackLinksToProcess) {
        const mRow = missingMorphemesMap.get(fl.morpheme_id);
        if (mRow) {
            if (!morphemesByConcept.has(fl.concept_id)) morphemesByConcept.set(fl.concept_id, []);
            morphemesByConcept.get(fl.concept_id)!.push({
                id: mRow.id,
                morpheme: mRow.morpheme,
                detected_type: mRow.detected_type,
                semantic_relevance: fl.semantic_relevance
            });
        }
    }

    // Finally, populate the morpheme pool
    for (const c of concepts.values()) {
        const morphemes = morphemesByConcept.get(c.id) || [];
        for (const m of morphemes) {
            if (!morphemePool.has(m.id)) {
                morphemePool.set(m.id, { morpheme: m.morpheme, score: m.semantic_relevance, source: c.source });
            } else if (morphemePool.get(m.id)!.source !== c.source) {
                morphemePool.get(m.id)!.source = 'hybrid';
            }
        }
    }

    const candidates: Candidate[] = [];
    let mKeys = Array.from(morphemePool.keys());
    
    // ULTIMATE FALLBACK: If mappings are completely missing (e.g. during partial D1 imports), 
    // fetch random morphemes directly to guarantee generation succeeds, AND explicitly use user intent.
    if (mKeys.length === 0) {
        if (req.intent) {
            for (const intentStr of req.intent) {
                const words = intentStr.split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, '').toLowerCase());
                for (const w of words) {
                    if (w.length >= 3) {
                        morphemePool.set(-(morphemePool.size + 1), { morpheme: w, score: 1.0, source: 'intent' });
                        // Extract syllables/fragments to allow beautiful blending (e.g., family -> fam, ily)
                        if (w.length >= 5) {
                            const half = Math.ceil(w.length / 2);
                            morphemePool.set(-(morphemePool.size + 1), { morpheme: w.substring(0, half), score: 0.8, source: 'intent' });
                            morphemePool.set(-(morphemePool.size + 1), { morpheme: w.substring(half - 1), score: 0.8, source: 'intent' });
                        }
                    }
                }
            }
        }
        
        // Inject a robust set of universal premium startup affixes and roots
        const premiumRoots = [
            'nova', 'vora', 'astra', 'omni', 'sync', 'flow', 'core', 'base', 'gen', 'pro', 'nexus', 'pulse',
            'ly', 'ify', 'io', 'ai', 'us', 'um', 'a', 'o', 'i', 'era', 'zen', 'x', 'z', 'on', 'in', 'en'
        ];
        
        for (const r of premiumRoots) {
            morphemePool.set(-(morphemePool.size + 1), { morpheme: r, score: 0.6, source: 'curated_fallback' });
        }
        
        mKeys = Array.from(morphemePool.keys());
    }
    
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
        
        while (generatedForQuota < quota.limit && iterations < 30) {
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
                
                // Skip PMI check to avoid Cloudflare Worker 50-subrequest limits
                // The co-occurrence can be skipped safely and defaulted.
                pmiScore = 0.5;
                
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
            const valResult = await validateCandidate(req.requestId, rawStr, db);
            if (!valResult.isValid) continue;

            // Phase 4.5A: Apply Mutation Engine to transform raw words
            const mutationResult = await mutator.mutateCandidate(rawStr, rawStr);
            
            // If mutation didn't change anything and we don't want exact dictionary words, we could drop it
            // but we will trust the engine's checkNovelty. Let's force some change if it's an exact intent word.
            let finalStr = mutationResult.mutatedString;
            
            // Safety measure: if the raw string is an exact match for one of the literal morphemes, 
            // and the mutation engine failed to change it, we manually add a random tech suffix 
            // so we don't output "Name" or "Creation".
            if (finalStr.toLowerCase() === rawStr.toLowerCase() && literalMorphemes.includes(rawStr.toLowerCase())) {
                const suffixes = ['io', 'ai', 'ify', 'ly', 'hq', 'tech'];
                finalStr += suffixes[Math.floor(Math.random() * suffixes.length)];
                mutationResult.mutationHistory.push('ForcedSuffix:PreventLiteralWord');
                mutationResult.mutationQualityScore = Math.max(mutationResult.mutationQualityScore, 0.8);
            }

            let mutationQuality = mutationResult.mutationQualityScore;
            let semanticPreservation = mutationResult.semanticPreservationScore;
            let history: string[] = mutationResult.mutationHistory;
            
            const finalPhono = await analyzePhonotactics(req.requestId, finalStr, db);
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
    const engine = await MutationEngine.create(db);
    for (const c of candidates) {
        const hssParent = calculateHSS(c);
        
        // Try up to 2 mutations
        for (let i = 0; i < 2; i++) {
            const mutResult = await engine.mutateCandidate(c.candidateString, c.candidateString);
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

    await persistDebugLog(req.requestId, 'INFO', 'ASSEMBLY_COMPLETE', `Generated ${uniqueCandidates.length} unique candidates.`, db);
    
    // Skip inserting all 100 generated candidates into generation_scores.
    // Cloudflare D1 allows max 50 subrequests per worker execution.
    // Doing 100 individual INSERT queries blows this limit instantly.
    
    return uniqueCandidates;
}

function calculateHSS(c: Candidate) {
    // Basic wrapper to get the score
    return optimizeHumanShortlist(c.candidateString, c.scoreComponents);
}
