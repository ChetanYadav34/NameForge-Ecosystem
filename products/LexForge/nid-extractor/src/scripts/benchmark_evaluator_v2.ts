import { optimizeHumanShortlist } from '../generation/human_shortlist_optimizer';
import { ALL_BENCHMARKS, BENCHMARK_CORPORA } from '../tests/benchmark_corpus';

export async function evaluateBenchmarksV2() {
    console.log("=== PHASE 4.6 BENCHMARK EVALUATOR V2 ===");
    
    let totalScore = 0;
    let falseNegatives: string[] = [];
    let recognizedCount = 0;

    const results = ALL_BENCHMARKS.map(name => {
        const comps = { semanticRelevance: 0.9 }; // Simulated high semantic relevance
        const result = optimizeHumanShortlist(name, comps);
        return {
            name,
            score: result.finalScore,
            isVetoed: result.isVetoed,
            reasons: result.vetoReasons
        };
    });

    results.sort((a, b) => b.score - a.score);

    console.log(`\nEvaluating ${results.length} total real-world benchmark companies...`);
    
    results.forEach((r, idx) => {
        totalScore += r.score;
        if (r.score < 80) falseNegatives.push(r.name);
        if (r.score >= 75) recognizedCount++;
    });

    const recognitionRate = (recognizedCount / results.length) * 100;
    const avgScore = totalScore / results.length;

    console.log(`\n=== METRICS ===`);
    console.log(`Average Benchmark Score: ${avgScore.toFixed(2)}`);
    console.log(`Benchmark Recognition Rate (>75 score): ${recognitionRate.toFixed(2)}% (Target: >80%)`);
    console.log(`False Negatives (<80 score): ${falseNegatives.length}`);

    if (falseNegatives.length > 0) {
        console.log(`\n=== FALSE NEGATIVES (Score < 80) ===`);
        falseNegatives.forEach(fn => {
            const res = results.find(r => r.name === fn);
            console.log(`[${fn}] Score: ${res?.score.toFixed(1)} | Veto: ${res?.isVetoed}`);
            if (res?.isVetoed) console.log(`  -> Veto Reasons: ${res?.reasons.join(', ')}`);
        });
    }

    console.log(`\n=== TOP 20 BENCHMARKS ===`);
    results.slice(0, 20).forEach((r, i) => {
        console.log(`${i+1}. [${r.name}] - ${r.score.toFixed(1)}`);
    });

    console.log(`\n=== BOTTOM 20 BENCHMARKS ===`);
    results.slice(-20).forEach((r, i) => {
        console.log(`${results.length - 20 + i + 1}. [${r.name}] - ${r.score.toFixed(1)}`);
    });
}

if (require.main === module) {
    evaluateBenchmarksV2().catch(console.error);
}
