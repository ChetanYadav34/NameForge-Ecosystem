import fs from 'fs';
import path from 'path';
import { generateNamesEndpoint } from '../api/generate';
import { assembleCandidates } from '../generation/candidate_assembler';
import { GenerationRequest } from '../generation/types';
import { AvailabilityService } from '../availability/availability_service';
import { SQLiteCompanyChecker } from '../availability/company_checker';
import { CachedDomainChecker, MockDomainProvider } from '../availability/domain_checker';
import { CachedTrademarkChecker, MockTrademarkProvider } from '../availability/trademark_checker';

// Dummy availability service so we don't fail generation
const dummyDbPath = path.resolve(__dirname, '../../data/dummy.sqlite');
const dummyCompanyChecker = new SQLiteCompanyChecker(dummyDbPath);
const dummyService = new AvailabilityService(dummyCompanyChecker, new CachedTrademarkChecker(dummyDbPath, new MockTrademarkProvider()), new CachedDomainChecker(dummyDbPath, new MockDomainProvider()));

async function runBlindReviewAndDiversityAudit() {
    console.log("=== BLIND REVIEW & DIVERSITY AUDIT ===");

    const strategies = ['industry', 'intent', 'hybrid'];
    const industries = ['SaaS', 'Fintech', 'Healthcare', 'AI'];
    let allCandidates: any[] = [];

    // Generate ~200 names
    for (const industry of industries) {
        for (const strategy of strategies) {
            console.log(`Generating ${industry} | ${strategy}...`);
            const req: GenerationRequest = {
                requestId: `blind_${industry}_${strategy}`,
                prompt: 'generate',
                industry: industry as any,
                intent: ['growth', 'trust'],
                strategy: strategy as any,
                availabilityCheck: false
            };
            const candidates = assembleCandidates(req);
            allCandidates.push(...candidates);
        }
    }

    // Deduplicate by name
    allCandidates = allCandidates.filter((v, i, a) => a.findIndex(t => t.candidateString === v.candidateString) === i);
    
    // Sort by finalScore (HumanShortlistScore) and take top 100
    allCandidates.sort((a, b) => (b.humanShortlistScore?.finalScore || 0) - (a.humanShortlistScore?.finalScore || 0));
    const top100 = allCandidates.slice(0, 100);

    // DIVERSITY AUDIT
    console.log("\n=== NAMING DIVERSITY AUDIT (Top 100) ===");
    const roots = new Set();
    const suffixes = new Set();
    const archetypes = new Set();
    let totalSyllables = 0;

    for (const c of top100) {
        const name = c.candidateString.toLowerCase();
        
        // Approximate Roots (first 4 chars) and Suffixes (last 3 chars)
        if (name.length >= 4) roots.add(name.substring(0, 4));
        if (name.length >= 5) suffixes.add(name.substring(name.length - 3));
        
        // Rough syllable count approximation based on vowel groups
        const vowels = name.match(/[aeiouy]+/g);
        totalSyllables += vowels ? vowels.length : 1;
    }

    console.log(`Unique Roots (Prefixes) Used: ${roots.size}`);
    console.log(`Unique Suffixes Used: ${suffixes.size}`);
    console.log(`Average Syllables per Name: ${(totalSyllables / 100).toFixed(2)}`);

    // EXPORT BLIND REVIEW
    console.log("\nExporting blind review csv...");
    const csvLines = ['Name,Industry']; // Removed scores and availability
    
    // Shuffle the top 100 to remove ranking bias
    const shuffled = [...top100].sort(() => Math.random() - 0.5);
    
    for (const c of shuffled) {
        // Find which industry it belonged to mostly via archetype or just output "Mixed"
        csvLines.push(`${c.candidateString},Mixed`);
    }

    const outPath = path.resolve(__dirname, '../../data/blind_review.csv');
    fs.writeFileSync(outPath, csvLines.join('\n'));
    console.log(`Exported to ${outPath}`);
}

if (require.main === module) {
    runBlindReviewAndDiversityAudit().catch(console.error);
}
