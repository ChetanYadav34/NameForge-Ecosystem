import Database from 'better-sqlite3';
import path from 'path';
import { GenerationRequest, Candidate } from '../generation/types';
import { assembleCandidates } from '../generation/candidate_assembler';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const db = new Database(DB_PATH);

const testCases = [
    { industry: 'Healthcare', intent: ['trust', 'safety', 'human', 'care'] },
    { industry: 'Financial Services', intent: ['freedom', 'independence', 'simplicity', 'control'] },
    { industry: 'Software', intent: ['speed', 'intelligence', 'effortless', 'workflow'] },
    { industry: 'AI', intent: ['human', 'augmentation', 'clarity', 'intelligence'] },
    { industry: 'Data', intent: ['turning', 'complexity', 'into', 'simple', 'decisions'] } // Note: intent extractor drops stopwords automatically
];

const strategies: ('industry' | 'intent' | 'hybrid')[] = ['industry', 'intent', 'hybrid'];

function runAudit() {
    console.log("=== PHASE 4.2B MUTATION & STRATEGY AUDIT ===\n");

    for (const tc of testCases) {
        console.log(`\n======================================================`);
        console.log(`INDUSTRY: ${tc.industry}`);
        console.log(`INTENT: ${tc.intent.join(', ')}`);
        console.log(`======================================================\n`);

        const resultsByStrategy: Record<string, Candidate[]> = {};

        for (const strat of strategies) {
            console.log(`--- Running Strategy: ${strat.toUpperCase()} ---`);
            const req: GenerationRequest = {
                requestId: uuidv4(),
                prompt: `Generate for ${tc.industry}`,
                industry: tc.industry,
                intent: tc.intent,
                strategy: strat
            };

            const candidates = assembleCandidates(req);
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

            for (const c of candidates) {
                avgBrandability += c.scoreComponents.structuralSuccess; // brandability is mixed in here roughly, or we can just print structural
                avgNovelty += c.scoreComponents.novelty;
                avgSemPres += c.scoreComponents.semanticPreservation;
                avgStratAlign += c.scoreComponents.strategyAlignment;
                avgDistinct += c.scoreComponents.conceptualDistinctiveness;
                if (c.mutationHistory && c.mutationHistory.length > 0) mutatedCount++;
            }
            
            avgBrandability /= candidates.length;
            avgNovelty /= candidates.length;
            avgSemPres /= candidates.length;
            avgStratAlign /= candidates.length;
            avgDistinct /= candidates.length;

            console.log(`Generated: ${candidates.length} unique candidates. Mutated: ${mutatedCount}`);
            console.log(`Avg Structural/Brand: ${avgBrandability.toFixed(3)} | Avg Novelty: ${avgNovelty.toFixed(3)} | Avg SemPres: ${avgSemPres.toFixed(3)} | Avg StratAlign: ${avgStratAlign.toFixed(3)} | Avg Distinct: ${avgDistinct.toFixed(3)}`);
            
            console.log(`\nTop 20 Candidates (${strat.toUpperCase()}):`);
            const top20 = candidates.slice(0, 20);
            for (let i = 0; i < top20.length; i++) {
                const c = top20[i];
                console.log(`  ${i + 1}. ${c.candidateString.padEnd(15)} [Score: ${c.compositeScore.toFixed(3)}, Src: ${c.strategySource}, Mut: ${(c.mutationHistory || []).join(',') || 'None'}]`);
            }
            console.log('\n');
        }

        // Calculate overlap
        const indStrs = new Set(resultsByStrategy['industry'].slice(0, 50).map(c => c.candidateString));
        const intStrs = new Set(resultsByStrategy['intent'].slice(0, 50).map(c => c.candidateString));
        
        let overlap = 0;
        for (const s of indStrs) {
            if (intStrs.has(s)) overlap++;
        }
        
        const overlapPct = (overlap / 50) * 100;
        console.log(`OVERLAP ANALYSIS: Industry vs Intent (Top 50) -> ${overlapPct.toFixed(1)}% overlap (${overlap} names shared)`);
        if (overlapPct > 20) {
            console.log(`⚠️ WARNING: Strategies may not be sufficiently distinct for this industry!`);
        } else {
            console.log(`✅ Strategies are highly distinct.`);
        }
    }
}

runAudit();
