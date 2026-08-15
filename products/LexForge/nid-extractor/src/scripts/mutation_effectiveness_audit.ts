import { MutationEngine } from '../generation/mutation_engine';
import { generateNamesEndpoint } from '../api/generate';
import { GenerationRequest } from '../generation/types';
import Database from 'better-sqlite3';
import path from 'path';
import { optimizeHumanShortlist } from '../generation/human_shortlist_optimizer';

async function runMutationAudit() {
    console.log("=== MUTATION EFFECTIVENESS AUDIT ===");

    const req: GenerationRequest = {
        requestId: 'mutation_test',
        prompt: 'generate',
        industry: 'Fintech',
        intent: ['trust', 'security'],
        strategy: 'hybrid',
        availabilityCheck: false
    };

    // We will generate 100 names to mutate
    console.log("Generating base names for mutation testing...");
    const dummyService: any = { checkAvailability: async () => ({ overallRisk: 0, companyRisk: 0, domainRisk: 0, trademarkRisk: 0, conflicts: [], exactMatch: false }) };
    
    const res = await generateNamesEndpoint(req, dummyService, 'free_user');
    const baseNames = res.candidates.map((c: any) => c.name);
    
    console.log(`Generated ${baseNames.length} base candidates. Applying mutations...`);

    const dbPath = path.resolve(__dirname, '../../data/nid.sqlite');
    const db = new Database(dbPath);
    const engine = new MutationEngine(db);

    let attempts = 0;
    let survivals = 0;
    let totalImprovement = 0;
    let worstRegression = 0; // Worst raw delta before being discarded

    for (const name of baseNames) {
        // Base HSS
        const baseHSS = optimizeHumanShortlist(name, { brandability: 0.8, semanticRelevance: 0.8 }).finalScore;
        
        // Try up to 3 mutations per name
        for (let i = 0; i < 3; i++) {
            attempts++;
            const mutResult = engine.mutateCandidate(name, name);
            if (mutResult.success && mutResult.mutatedString !== name) {
                const mutHSS = optimizeHumanShortlist(mutResult.mutatedString, { brandability: 0.8, semanticRelevance: 0.8 }).finalScore;
                
                const delta = mutHSS - baseHSS;
                if (delta < worstRegression) {
                    worstRegression = delta;
                }
                
                if (delta > 0) {
                    survivals++;
                    totalImprovement += delta;
                }
            }
        }
    }

    const attemptRate = (attempts / (baseNames.length * 3)) * 100;
    const survivalRate = attempts > 0 ? (survivals / attempts) * 100 : 0;
    const avgImprovement = survivals > 0 ? (totalImprovement / survivals) : 0;

    console.log(`\n=== MUTATION METRICS ===`);
    console.log(`Total Attempts: ${attempts}`);
    console.log(`Total Survivals: ${survivals}`);
    console.log(`Attempt Rate: ${attemptRate.toFixed(1)}%`);
    console.log(`Survival Rate (Mutations that improved HSS): ${survivalRate.toFixed(1)}%`);
    console.log(`Average Improvement Delta (for surviving mutations): +${avgImprovement.toFixed(2)} pts`);
    console.log(`Worst Regression Delta (Discarded by conditional check): ${worstRegression.toFixed(2)} pts`);
}

if (require.main === module) {
    runMutationAudit().catch(console.error);
}
