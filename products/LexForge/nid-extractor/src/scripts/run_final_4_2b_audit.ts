import Database from 'better-sqlite3';
import path from 'path';
import { GenerationRequest, Candidate } from '../generation/types';
import { assembleCandidates } from '../generation/candidate_assembler';
import { v4 as uuidv4 } from 'uuid';
import { performance } from 'perf_hooks';
import { MutationEngine } from '../generation/mutation_engine';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const db = new Database(DB_PATH);

const testCases = [
    { industry: 'Healthcare', intent: ['trust', 'safety', 'human', 'care'] },
    { industry: 'Financial Services', intent: ['freedom', 'independence', 'simplicity', 'control'] },
    { industry: 'Software', intent: ['speed', 'intelligence', 'effortless', 'workflow'] },
    { industry: 'AI', intent: ['human', 'augmentation', 'clarity', 'intelligence'] },
    { industry: 'Data', intent: ['turning', 'complexity', 'into', 'simple', 'decisions'] }
];

const strategies: ('industry' | 'intent' | 'hybrid')[] = ['industry', 'intent', 'hybrid'];

const regressionNames = ['healt', 'helt', 'rahq', 'anly', 'aiify', 'alalt', 'daio', 'atio'];
const noveltyTestCases = [
    { name: 'Stripe', candidate: 'Strype' },
    { name: 'Shopify', candidate: 'Shopifyy' },
    { name: 'Apple', candidate: 'Appel' },
    { name: 'Uber', candidate: 'Ubar' }
];

function runFinalAudit() {
    console.log("==================================================");
    console.log("PHASE 4.2B FINAL REVIEW & HARDENING AUDIT");
    console.log("==================================================\n");
    
    let totalMutationsAttempted = 0;
    let totalMutationsAccepted = 0;
    let totalMutationsRejected = 0;
    let maxMutationLatency = 0;
    let totalMutationLatency = 0;

    for (const tc of testCases) {
        console.log(`\n==================================================`);
        console.log(`INDUSTRY: ${tc.industry}`);
        console.log(`INTENT: ${tc.intent.join(', ')}`);
        console.log(`==================================================\n`);

        const resultsByStrategy: Record<string, Candidate[]> = {};
        
        for (const strat of strategies) {
            console.log(`\n--- Running Strategy: ${strat.toUpperCase()} ---`);
            const req: GenerationRequest = {
                requestId: uuidv4(),
                prompt: `Generate for ${tc.industry}`,
                industry: tc.industry,
                intent: tc.intent,
                strategy: strat
            };

            const startTime = performance.now();
            const candidates = assembleCandidates(req);
            const endTime = performance.now();
            const latency = endTime - startTime;

            resultsByStrategy[strat] = candidates;

            if (candidates.length === 0) {
                console.log(`No candidates generated for ${strat}.\n`);
                continue;
            }

            let avgBrandability = 0;
            let avgNovelty = 0;
            let avgSemPres = 0;
            let avgStratAlign = 0;
            let avgDistinct = 0;
            let mutatedCount = 0;

            const regressionHits = [];

            for (const c of candidates) {
                avgBrandability += c.scoreComponents.structuralSuccess;
                avgNovelty += c.scoreComponents.novelty;
                avgSemPres += c.scoreComponents.semanticPreservation || 0;
                avgStratAlign += c.scoreComponents.strategyAlignment || 0;
                avgDistinct += c.scoreComponents.conceptualDistinctiveness || 0;
                
                if (c.mutationHistory && c.mutationHistory.length > 0) mutatedCount++;
                
                if (regressionNames.includes(c.candidateString.toLowerCase())) {
                    regressionHits.push(c.candidateString);
                }
            }

            const count = candidates.length;
            avgBrandability /= count;
            avgNovelty /= count;
            avgSemPres /= count;
            avgStratAlign /= count;
            avgDistinct /= count;

            console.log(`Generated: ${count} candidates | Mutated: ${mutatedCount} | Latency: ${latency.toFixed(2)}ms`);
            console.log(`Metrics: Brand/Struct: ${avgBrandability.toFixed(3)} | Novelty: ${avgNovelty.toFixed(3)} | SemPres: ${avgSemPres.toFixed(3)} | Align: ${avgStratAlign.toFixed(3)} | Distinct: ${avgDistinct.toFixed(3)}`);
            if (regressionHits.length > 0) {
                console.log(`⚠️ REGRESSION HITS: ${regressionHits.join(', ')}`);
            } else {
                console.log(`✅ No regression hits in this set.`);
            }

            console.log(`\nTop 20 Candidates (${strat.toUpperCase()}):`);
            const top20 = candidates.slice(0, 20);
            for (let i = 0; i < top20.length; i++) {
                const c = top20[i];
                console.log(`  ${(i + 1).toString().padStart(2, ' ')}. ${c.candidateString.padEnd(15)} [Score: ${c.compositeScore.toFixed(3)}]`);
                console.log(`      Brand: ${c.scoreComponents.structuralSuccess.toFixed(3)} | Novelty: ${c.scoreComponents.novelty.toFixed(3)} | MutHist: ${(c.mutationHistory || []).join(', ') || 'None'}`);
                if (strat === 'hybrid' && i < 3) {
                    console.log(`      Hybrid Breakdown -> Source: ${c.strategySource}`);
                }
            }
        }

        // STRATEGY OVERLAP ANALYSIS
        const indStrs = new Set(resultsByStrategy['industry']?.slice(0, 50).map(c => c.candidateString.toLowerCase()) || []);
        const intStrs = new Set(resultsByStrategy['intent']?.slice(0, 50).map(c => c.candidateString.toLowerCase()) || []);
        const hybStrs = new Set(resultsByStrategy['hybrid']?.slice(0, 50).map(c => c.candidateString.toLowerCase()) || []);
        
        let indIntOverlap = 0;
        for (const s of indStrs) if (intStrs.has(s)) indIntOverlap++;
        
        let indHybOverlap = 0;
        for (const s of indStrs) if (hybStrs.has(s)) indHybOverlap++;
        
        let intHybOverlap = 0;
        for (const s of intStrs) if (hybStrs.has(s)) intHybOverlap++;
        
        console.log(`\n--- OVERLAP ANALYSIS (Top 50) ---`);
        console.log(`Industry vs Intent: ${(indIntOverlap / 50 * 100).toFixed(1)}% (${indIntOverlap} names)`);
        console.log(`Industry vs Hybrid: ${(indHybOverlap / 50 * 100).toFixed(1)}% (${indHybOverlap} names)`);
        console.log(`Intent   vs Hybrid: ${(intHybOverlap / 50 * 100).toFixed(1)}% (${intHybOverlap} names)`);
    }

    console.log("\n==================================================");
    console.log("NOVELTY PROTECTION TEST");
    console.log("==================================================");
    
    // We will simulate the MutationEngine novelty check directly
    const mutationEngine = new MutationEngine(db);
    for (const test of noveltyTestCases) {
        const res = (mutationEngine as any).checkNovelty(test.candidate);
        console.log(`Candidate: ${test.candidate.padEnd(10)} | Base Target: ${test.name.padEnd(10)} | Novelty Score: ${res.toFixed(3)}`);
        if (res < 0.5) {
            console.log(`  ✅ REJECTED (High similarity/conflict)`);
        } else {
            console.log(`  ⚠️ ACCEPTED (Novelty protection failed)`);
        }
    }
}

runFinalAudit();
