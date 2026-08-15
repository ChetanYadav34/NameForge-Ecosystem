import path from 'path';
import { performance } from 'perf_hooks';
import { SQLiteCompanyChecker } from '../availability/company_checker';
import { CachedDomainChecker, MockDomainProvider } from '../availability/domain_checker';
import { CachedTrademarkChecker, MockTrademarkProvider } from '../availability/trademark_checker';
import { AvailabilityService } from '../availability/availability_service';
import { generateNamesEndpoint } from '../api/generate';
import { GenerationRequest } from '../generation/types';

const testCases = [
    { industry: 'Healthcare', intent: ['trust', 'care'] },
    { industry: 'Financial Services', intent: ['freedom', 'control'] },
    { industry: 'Software', intent: ['speed', 'workflow'] },
    { industry: 'AI', intent: ['intelligence', 'augmentation'] },
    { industry: 'Data', intent: ['simple', 'decisions'] }
];

const strategies: ('industry' | 'intent' | 'hybrid')[] = ['industry', 'intent', 'hybrid'];

async function runAudit() {
    console.log("==================================================");
    console.log("PHASE 4.3 AVAILABILITY INTELLIGENCE AUDIT");
    console.log("==================================================\n");

    const dbPath = path.resolve(__dirname, '../../data/nid.sqlite');
    const companyChecker = new SQLiteCompanyChecker(dbPath);
    const domainChecker = new CachedDomainChecker(dbPath, new MockDomainProvider());
    const tmChecker = new CachedTrademarkChecker(dbPath, new MockTrademarkProvider());
    const service = new AvailabilityService(companyChecker, tmChecker, domainChecker);

    let metrics = {
        totalChecks: 0,
        exactCompany: 0,
        similarCompany: 0,
        exactTm: 0,
        similarTm: 0,
        domainCom: { avail: 0, reg: 0, unk: 0 },
        domainIo: { avail: 0, reg: 0, unk: 0 },
        domainAi: { avail: 0, reg: 0, unk: 0 },
        domainCo: { avail: 0, reg: 0, unk: 0 },
        unknowns: 0,
        cacheHits: 0,
        latencySum: 0,
        latencies: [] as number[],
        riskDistribution: { high: 0, medium: 0, low: 0 }
    };

    console.log("Warming up company checker...");
    await companyChecker.checkCompanyConflict('warmup');

    for (const tc of testCases) {
        console.log(`\nEvaluating: ${tc.industry} | ${tc.intent.join(',')}`);
        
        for (const strat of strategies) {
            const req: GenerationRequest = {
                requestId: 'audit_' + Math.random(),
                prompt: 'generate',
                industry: tc.industry,
                intent: tc.intent,
                strategy: strat,
                availabilityCheck: true
            };

            const startTime = performance.now();
            const res = await generateNamesEndpoint(req, service, 'paid_user');
            const endTime = performance.now();
            const latency = endTime - startTime;
            
            metrics.latencies.push(latency);
            metrics.latencySum += latency;

            for (const c of res.candidates) {
                metrics.totalChecks++;
                
                const avail = c.availability;
                
                if (avail.companyConflict.status === 'EXACT_CONFLICT') metrics.exactCompany++;
                if (avail.companyConflict.status === 'SIMILAR_CONFLICT') metrics.similarCompany++;
                
                if (avail.trademark.status === 'EXACT_CONFLICT') metrics.exactTm++;
                if (avail.trademark.status === 'SIMILAR_CONFLICT') metrics.similarTm++;
                if (avail.trademark.status === 'UNKNOWN') metrics.unknowns++;
                if (avail.trademark.provider.includes('cache')) metrics.cacheHits++;
                
                ['com', 'io', 'ai', 'co'].forEach(tld => {
                    const st = avail.domains[tld]?.status;
                    if (st === 'AVAILABLE') metrics[`domain${tld.charAt(0).toUpperCase() + tld.slice(1)}` as any].avail++;
                    if (st === 'REGISTERED') metrics[`domain${tld.charAt(0).toUpperCase() + tld.slice(1)}` as any].reg++;
                    if (st === 'UNKNOWN') metrics[`domain${tld.charAt(0).toUpperCase() + tld.slice(1)}` as any].unk++;
                    
                    if (avail.domains[tld]?.provider.includes('cache')) metrics.cacheHits++;
                });

                if (c.scores.availabilityRisk >= 0.8) metrics.riskDistribution.high++;
                else if (c.scores.availabilityRisk >= 0.3) metrics.riskDistribution.medium++;
                else metrics.riskDistribution.low++;
            }
        }
    }

    metrics.latencies.sort((a, b) => a - b);
    const p50 = metrics.latencies[Math.floor(metrics.latencies.length * 0.5)];
    const p95 = metrics.latencies[Math.floor(metrics.latencies.length * 0.95)];

    console.log("\n==================================================");
    console.log("AUDIT RESULTS");
    console.log("==================================================");
    console.log(`Total Candidates Checked (Top 50 per strat): ${metrics.totalChecks}`);
    console.log(`Company Conflicts: ${metrics.exactCompany} Exact, ${metrics.similarCompany} Similar`);
    console.log(`Trademark Conflicts: ${metrics.exactTm} Exact, ${metrics.similarTm} Similar`);
    console.log(`Domain .com : ${metrics.domainCom.avail} Avail, ${metrics.domainCom.reg} Reg, ${metrics.domainCom.unk} Unk`);
    console.log(`Domain .io  : ${metrics.domainIo.avail} Avail, ${metrics.domainIo.reg} Reg, ${metrics.domainIo.unk} Unk`);
    console.log(`Domain .ai  : ${metrics.domainAi.avail} Avail, ${metrics.domainAi.reg} Reg, ${metrics.domainAi.unk} Unk`);
    console.log(`Domain .co  : ${metrics.domainCo.avail} Avail, ${metrics.domainCo.reg} Reg, ${metrics.domainCo.unk} Unk`);
    console.log(`Unknown Responses: ${metrics.unknowns}`);
    console.log(`Cache Hits: ${metrics.cacheHits}`);
    console.log(`Risk Distribution: High: ${metrics.riskDistribution.high}, Med: ${metrics.riskDistribution.medium}, Low: ${metrics.riskDistribution.low}`);
    
    console.log("\n==================================================");
    console.log("PERFORMANCE (Paid flow)");
    console.log("==================================================");
    console.log(`Avg Latency per batch (Top 50): ${(metrics.latencySum / metrics.latencies.length).toFixed(2)}ms`);
    console.log(`p50 Latency: ${p50.toFixed(2)}ms`);
    console.log(`p95 Latency: ${p95.toFixed(2)}ms`);

    // Run a Free check
    console.log("\n==================================================");
    console.log("FREE vs PAID BEHAVIOR VERIFICATION");
    console.log("==================================================");
    const freeReq: GenerationRequest = {
        requestId: 'free_audit',
        prompt: 'test',
        industry: 'Healthcare',
        strategy: 'hybrid',
        availabilityCheck: true // The free endpoint should ignore this
    };
    const freeRes = await generateNamesEndpoint(freeReq, service, 'free_user');
    const freeCheck = freeRes.candidates[0];
    console.log(`Free User Company Status: ${freeCheck.availability.companyConflict.status}`);
    console.log(`Free User Trademark Status: ${freeCheck.availability.trademark.status}`);
    console.log(`Free User Domain Status: ${freeCheck.availability.domains.com.status}`);
    if (freeCheck.availability.companyConflict.status === 'NOT_CHECKED') {
        console.log("✅ FREE Tier enforcement passed.");
    } else {
        console.log("❌ FREE Tier enforcement failed.");
    }
}

runAudit();
