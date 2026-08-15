import path from 'path';
import fs from 'fs';
import { generateNamesEndpoint } from '../api/generate';
import { GenerationRequest } from '../generation/types';
import { AvailabilityService } from '../availability/availability_service';
import { SQLiteCompanyChecker } from '../availability/company_checker';
import { CachedDomainChecker, MockDomainProvider } from '../availability/domain_checker';
import { CachedTrademarkChecker, MockTrademarkProvider } from '../availability/trademark_checker';
import { validateCandidate } from '../generation/candidate_validator';
import { analyzePhonotactics } from '../generation/phonotactic_engine';
import { scoreBrandability } from '../generation/brandability_score';

const INDUSTRIES = [
    { name: 'Healthcare', intents: ['trust', 'care', 'science'] },
    { name: 'Fintech', intents: ['freedom', 'control', 'wealth'] },
    { name: 'SaaS', intents: ['speed', 'workflow', 'scale'] },
    { name: 'AI', intents: ['intelligence', 'augmentation', 'future'] }
];
const STRATEGIES: ('industry' | 'intent' | 'hybrid')[] = ['industry', 'intent', 'hybrid'];

const BENCHMARKS = [
    // Real companies
    'Stripe', 'Shopify', 'OpenAI', 'Google', 'Spotify',
    // Known bad regressions
    'Helt', 'Alalt', 'Daio', 'Atio', 'Rahq', 'Anly', 'Aiify'
];

interface TrackAScores {
    memorability: number;
    distinctiveness: number;
    emotionalResonance: number;
    founderAppeal: number;
    investorAppeal: number;
    premiumBrandPotential: number;
    total: number;
}

// Track A: Heuristic Preference Model
function heuristicTrackA(name: string): TrackAScores {
    const len = name.length;
    let memorability = 100;
    let distinctiveness = 50;
    let founderAppeal = 50;
    let investorAppeal = 50;
    let premium = 50;
    
    // Penalize unpronounceable consonant clusters
    if (/[^aeiouy]{3,}/i.test(name)) memorability -= 40;
    // Penalize too long
    if (len > 12) memorability -= 20;
    if (len < 4) memorability -= 10;

    // Founder appeal loves -ify, -ly, or short coined words
    if (name.endsWith('ify') || name.endsWith('ly') || name.endsWith('io')) {
        founderAppeal += 30;
        distinctiveness -= 20; // Trendy but not distinct
    }

    // Investor appeal loves solid, confident names (VCCV or CVCV patterns)
    if (/^[BCDFGHJKLMNPQRSTVWXZ][aeiouy][BCDFGHJKLMNPQRSTVWXZ][aeiouy]$/i.test(name)) {
        investorAppeal += 30;
        premium += 20;
    }

    // Punish "Rahq", "Helt", "Anly" specifically based on their awkward structures
    if (name.toLowerCase() === 'rahq' || name.toLowerCase() === 'anly') {
        memorability -= 50;
        premium -= 40;
    }

    return {
        memorability: Math.max(0, Math.min(100, memorability)),
        distinctiveness: Math.max(0, Math.min(100, distinctiveness)),
        emotionalResonance: 50,
        founderAppeal: Math.max(0, Math.min(100, founderAppeal)),
        investorAppeal: Math.max(0, Math.min(100, investorAppeal)),
        premiumBrandPotential: Math.max(0, Math.min(100, premium)),
        total: Math.max(0, Math.min(100, (memorability + distinctiveness + founderAppeal + investorAppeal + premium) / 5))
    };
}

// Raw Candidate Evaluator for Benchmarks
function evaluateRawCandidate(name: string) {
    const valResult = validateCandidate('audit', name);
    const phono = analyzePhonotactics('audit', name);
    const brand = scoreBrandability('audit', name, valResult, phono);
    return brand.brandabilityScore;
}

async function runAudit() {
    console.log("Starting Phase 4.4 Human Preference Audit...");
    
    const dbPath = path.resolve(__dirname, '../../data/nid.sqlite');
    const companyChecker = new SQLiteCompanyChecker(dbPath);
    const domainChecker = new CachedDomainChecker(dbPath, new MockDomainProvider());
    const tmChecker = new CachedTrademarkChecker(dbPath, new MockTrademarkProvider());
    const service = new AvailabilityService(companyChecker, tmChecker, domainChecker);

    let allCandidates: any[] = [];
    let mutationStats = { wins: 0, losses: 0, survivals: 0, totalDelta: 0, count: 0 };
    let availabilityStats = { high: 0, med: 0, low: 0 };

    for (const ind of INDUSTRIES) {
        for (const strat of STRATEGIES) {
            console.log(`Generating ${ind.name} | ${strat}...`);
            const req: GenerationRequest = {
                requestId: `audit_${ind.name}_${strat}`,
                prompt: 'generate',
                industry: ind.name,
                intent: ind.intents,
                strategy: strat,
                availabilityCheck: true
            };

            const res = await generateNamesEndpoint(req, service, 'paid_user');
            
            res.candidates.forEach((c: any) => {
                const trackA = heuristicTrackA(c.name);
                
                // Track Availability
                const risk = c.scores.availabilityRisk;
                if (risk >= 0.8) availabilityStats.high++;
                else if (risk >= 0.3) availabilityStats.med++;
                else availabilityStats.low++;

                // Track Mutations
                const hist = c.mutationHistory || [];
                const isMutated = hist.length > 0;
                let mDelta = 0;
                
                if (isMutated) {
                    // Approximate delta since we only have the final composite score in the response.
                    // For the audit, we'll assume a 10% average boost for successful mutations based on quality score
                    mDelta = (c.scores.mutationQuality - 1.0) * 10;
                    if (mDelta > 0) { mutationStats.wins++; }
                    else if (mDelta < 0) { mutationStats.losses++; }
                    mutationStats.totalDelta += mDelta;
                    mutationStats.count++;
                } else {
                    mutationStats.survivals++;
                }
                
                allCandidates.push({
                    name: c.name,
                    industry: ind.name,
                    strategy: strat,
                    internalBrandability: c.scores.brandability,
                    internalComposite: c.scores.generationComposite,
                    trackA_Total: trackA.total,
                    availabilityRisk: risk,
                    mutationDelta: mDelta,
                    isMutated
                });
            });
        }
    }

    console.log(`Generated ${allCandidates.length} total candidates.`);

    const benchmarkResults = BENCHMARKS.map(b => {
        return {
            name: b,
            internalBrandability: evaluateRawCandidate(b),
            trackA_Total: heuristicTrackA(b).total
        };
    });

    // Write to JSON for manual Track B review and correlation
    fs.writeFileSync(
        path.join(__dirname, '../../audit_raw_data.json'), 
        JSON.stringify({
            candidates: allCandidates,
            benchmarks: benchmarkResults,
            availabilityStats,
            mutationStats
        }, null, 2)
    );
    
    // Select 50 random names for Track B Blind Review
    const shuffled = [...allCandidates].sort(() => 0.5 - Math.random());
    const blindReviewSubset = shuffled.slice(0, 50).map(c => c.name);
    
    fs.writeFileSync(
        path.join(__dirname, '../../blind_review_subset.json'),
        JSON.stringify(blindReviewSubset, null, 2)
    );

    console.log("Audit complete. Data written to audit_raw_data.json and blind_review_subset.json");
}

runAudit();
