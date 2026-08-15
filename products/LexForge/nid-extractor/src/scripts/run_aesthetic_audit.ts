import path from 'path';
import fs from 'fs';
import { generateNamesEndpoint } from '../api/generate';
import { GenerationRequest } from '../generation/types';
import { AvailabilityService } from '../availability/availability_service';
import { SQLiteCompanyChecker } from '../availability/company_checker';
import { CachedDomainChecker, MockDomainProvider } from '../availability/domain_checker';
import { CachedTrademarkChecker, MockTrademarkProvider } from '../availability/trademark_checker';

const INDUSTRIES = [
    { name: 'Healthcare', intents: ['trust', 'care', 'science'] },
    { name: 'Fintech', intents: ['freedom', 'control', 'wealth'] },
    { name: 'SaaS', intents: ['speed', 'workflow', 'scale'] },
    { name: 'AI', intents: ['intelligence', 'augmentation', 'future'] }
];
const STRATEGIES: ('industry' | 'intent' | 'hybrid')[] = ['industry', 'intent', 'hybrid'];

async function runAestheticAudit() {
    console.log("Starting Phase 4.5 Aesthetic Calibration Audit...");
    
    const dbPath = path.resolve(__dirname, '../../data/nid.sqlite');
    const companyChecker = new SQLiteCompanyChecker(dbPath);
    const domainChecker = new CachedDomainChecker(dbPath, new MockDomainProvider());
    const tmChecker = new CachedTrademarkChecker(dbPath, new MockTrademarkProvider());
    const service = new AvailabilityService(companyChecker, tmChecker, domainChecker);

    let allCandidates: any[] = [];
    let availabilityStats = { high: 0, med: 0, low: 0 };
    let shortlistCount = 0;
    
    const TOTAL_REQUESTS = INDUSTRIES.length * STRATEGIES.length;

    for (const ind of INDUSTRIES) {
        for (const strat of STRATEGIES) {
            console.log(`Generating ${ind.name} | ${strat}...`);
            const req: GenerationRequest = {
                requestId: `audit_4.5_${ind.name}_${strat}`,
                prompt: 'generate',
                industry: ind.name,
                intent: ind.intents,
                strategy: strat,
                availabilityCheck: true
            };

            // Using 'paid_user' to ensure availability is checked
            const res = await generateNamesEndpoint(req, service, 'paid_user');
            
            res.candidates.forEach((c: any) => {
                const hss = c.scores.humanShortlistScore || 0;
                if (hss >= 80) shortlistCount++;
                
                const risk = c.scores.availabilityRisk;
                if (risk >= 0.8) availabilityStats.high++;
                else if (risk >= 0.3) availabilityStats.med++;
                else availabilityStats.low++;

                allCandidates.push({
                    name: c.name,
                    industry: ind.name,
                    strategy: strat,
                    humanShortlistScore: hss,
                    availabilityRisk: risk,
                    finalComposite: c.scores.generationComposite
                });
            });
        }
    }

    // Sort by humanShortlistScore desc
    allCandidates.sort((a, b) => b.humanShortlistScore - a.humanShortlistScore);
    
    const total = allCandidates.length;
    const shortlistRate = (shortlistCount / total) * 100;
    const highRiskRate = (availabilityStats.high / total) * 100;
    
    console.log(`\n=== METRICS ===`);
    console.log(`Total Generated: ${total}`);
    console.log(`Human Shortlist Rate (>80 score): ${shortlistRate.toFixed(2)}% (Target: >25%)`);
    console.log(`Availability High Risk Rate: ${highRiskRate.toFixed(2)}% (Target: <30%)`);
    
    console.log(`\n=== HALL OF FAME (Top 15) ===`);
    allCandidates.slice(0, 15).forEach(c => {
        console.log(`${c.name.padEnd(15)} | HSS: ${c.humanShortlistScore.toFixed(1)} | Risk: ${c.availabilityRisk.toFixed(2)}`);
    });

    console.log(`\n=== HALL OF SHAME (Bottom 15) ===`);
    // Filter out names that are strictly 0 to see the lowest valid ones, or just show the absolute bottoms.
    // Actually, vetoed names are 0, so bottom 15 will be all 0s. Let's filter > 0.
    const nonVetoed = allCandidates.filter(c => c.humanShortlistScore > 0);
    nonVetoed.slice(-15).reverse().forEach(c => {
        console.log(`${c.name.padEnd(15)} | HSS: ${c.humanShortlistScore.toFixed(1)} | Risk: ${c.availabilityRisk.toFixed(2)}`);
    });

    // Write full output to JSON
    fs.writeFileSync(
        path.join(__dirname, '../../audit_4.5_results.json'),
        JSON.stringify({
            metrics: {
                total,
                shortlistRate,
                highRiskRate,
                availabilityStats
            },
            candidates: allCandidates
        }, null, 2)
    );
}

if (require.main === module) {
    runAestheticAudit().catch(console.error);
}
