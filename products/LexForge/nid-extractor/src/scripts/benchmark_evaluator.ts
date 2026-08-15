import { scoreAesthetics } from '../generation/aesthetic_scoring';
import { detectClunkiness } from '../generation/clunkiness_detector';
import { optimizeHumanShortlist } from '../generation/human_shortlist_optimizer';

const PREMIUM_BENCHMARKS = [
    'Stripe', 'Shopify', 'Figma', 'Linear', 'Notion', 
    'Ramp', 'OpenAI', 'Anthropic', 'Vercel', 'Datadog'
];

const REGRESSION_TRAPS = [
    'Helt', 'Alalt', 'Eehq', 'Tiify', 'Loer', 'Daio', 'Atio'
];

export async function evaluateBenchmarks() {
    console.log("=== PREMIUM BENCHMARK EVALUATION ===");
    for (const name of PREMIUM_BENCHMARKS) {
        const comps = { semanticRelevance: 0.9 }; // Simulated perfect prompt match
        const result = optimizeHumanShortlist(name, comps);
        const rank = result.finalScore > 90 ? "TOP 1% (A-GRADE)" : (result.finalScore > 80 ? "TOP 5% (B-GRADE)" : "FAIL");
        console.log(`[${name}] Score: ${result.finalScore.toFixed(2)} | Veto: ${result.isVetoed} | Rank: ${rank}`);
        if (result.isVetoed) console.log(`  -> Veto Reasons: ${result.vetoReasons.join(', ')}`);
    }

    console.log("\n=== REGRESSION TRAPS EVALUATION ===");
    for (const name of REGRESSION_TRAPS) {
        const comps = { semanticRelevance: 0.9 }; 
        const result = optimizeHumanShortlist(name, comps);
        console.log(`[${name}] Score: ${result.finalScore.toFixed(2)} | Veto: ${result.isVetoed}`);
        if (result.isVetoed) console.log(`  -> Veto Reasons: ${result.vetoReasons.join(', ')}`);
    }
}

if (require.main === module) {
    evaluateBenchmarks().catch(console.error);
}
