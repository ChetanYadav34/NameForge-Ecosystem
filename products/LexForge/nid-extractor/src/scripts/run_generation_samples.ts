import { assembleCandidates } from '../generation/candidate_assembler';
import { GenerationRequest, Candidate } from '../generation/types';

function runAudit() {
    console.log("=== Phase 4.2A: Generation Audit Script ===");

    const industries = [
        { name: 'Healthcare', ref: 'healthtech', style: 'apple-like' },
        { name: 'Financial Services', ref: 'fintech', style: 'stripe-like' },
        { name: 'Software', ref: 'saas', style: 'shopify-like' },
        { name: 'Data & Analytics', ref: 'ai', style: 'pinterest-like' } // we will map 'AI' to Data
    ];

    for (const ind of industries) {
        console.log(`\n--- Generating Samples for: ${ind.name} (Style: ${ind.style}) ---`);
        
        const req: GenerationRequest = {
            requestId: `audit-${ind.ref}-${Date.now()}`,
            prompt: `Build a next-gen ${ind.ref} platform`,
            industry: ind.name,
            styleReferences: [ind.style]
        };

        const candidates = assembleCandidates(req);
        
        if (candidates.length === 0) {
            console.log(`No valid candidates generated for ${ind.name}.`);
            continue;
        }
        
        // Compute metrics
        let totalBrandability = 0;
        let totalPronounceability = 0;
        
        for (const c of candidates as any[]) {
            if (c.brandabilityResult) totalBrandability += c.brandabilityResult.brandabilityScore;
            if (c.phonotacticResult) totalPronounceability += c.phonotacticResult.pronounceabilityScore;
        }

        const avgBrandability = totalBrandability / candidates.length;
        const avgPronounceability = totalPronounceability / candidates.length;
        
        // The assembler generates up to 100 limit, but loop cap is 3000. So Rejected count = 3000 - candidates.length (roughly)
        // A better metric is just stating we succeeded in getting X valid out of max.
        
        console.log(`Successfully generated ${candidates.length} highly validated candidates.`);
        console.log(`Average Brandability Score: ${avgBrandability.toFixed(2)}`);
        console.log(`Average Pronounceability Score: ${avgPronounceability.toFixed(2)}`);
        console.log(`\nTop 20 Ranked Candidates:`);
        
        const top20 = candidates.slice(0, 20) as any[];
        for (let i = 0; i < top20.length; i++) {
            const c = top20[i];
            const brandStr = c.brandabilityResult ? c.brandabilityResult.brandabilityScore.toFixed(1) : 'N/A';
            const phonoStr = c.phonotacticResult ? c.phonotacticResult.pronounceabilityScore.toFixed(2) : 'N/A';
            console.log(`  ${(i + 1).toString().padStart(2, ' ')}. ${c.candidateString.padEnd(16)} [Comp: ${c.compositeScore.toFixed(3)} | Brand: ${brandStr} | Phono: ${phonoStr}] (${c.archetype})`);
        }
    }
}

if (require.main === module) {
    runAudit();
}
