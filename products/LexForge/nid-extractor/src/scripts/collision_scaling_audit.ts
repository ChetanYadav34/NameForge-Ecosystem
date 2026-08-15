import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { SQLiteCompanyChecker } from '../availability/company_checker';
import { generateNamesEndpoint } from '../api/generate';
import { GenerationRequest } from '../generation/types';
import { AvailabilityService } from '../availability/availability_service';
import { MockDomainProvider, CachedDomainChecker } from '../availability/domain_checker';
import { MockTrademarkProvider, CachedTrademarkChecker } from '../availability/trademark_checker';

// 1. Synthetic Corpus Generator
function createSyntheticCorpus(dbPath: string, size: number) {
    try {
        if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
    } catch(e) {}
    const db = new Database(dbPath);
    
    db.exec(`
        CREATE TABLE IF NOT EXISTS company_normalized (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_name TEXT NOT NULL,
            normalized_name TEXT NOT NULL,
            phonetic_key TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_company_name ON company_normalized(normalized_name);
        
        CREATE TABLE IF NOT EXISTS domain_cache (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            tld TEXT NOT NULL,
            status TEXT NOT NULL,
            provider TEXT,
            checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME
        );
        CREATE TABLE IF NOT EXISTS trademark_cache (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            jurisdiction TEXT NOT NULL,
            status TEXT NOT NULL,
            provider TEXT,
            checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME,
            raw_response TEXT
        );
    `);

    const insert = db.prepare(`INSERT INTO company_normalized (original_name, normalized_name, phonetic_key) VALUES (?, ?, ?)`);
    
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels = 'aeiou';
    
    // Generate 'size' random realistic-ish words
    db.transaction(() => {
        for (let i = 0; i < size; i++) {
            let name = '';
            const len = Math.floor(Math.random() * 5) + 4; // 4 to 8 chars
            for (let j = 0; j < len; j++) {
                if (j % 2 === 0) name += consonants[Math.floor(Math.random() * consonants.length)];
                else name += vowels[Math.floor(Math.random() * vowels.length)];
            }
            // Occasionally append 'inc' or 'co'
            if (Math.random() > 0.8) name += ' inc';
            else if (Math.random() > 0.9) name += ' co';
            
            insert.run(name, name.toLowerCase(), name.toLowerCase());
        }
    })();

    db.close();
}

async function runCollisionScalingAudit() {
    console.log("=== COLLISION SCALING AUDIT ===");
    const sizes = [5000, 10000, 25000, 50000, 100000];
    
    // Generate a fixed batch of 100 names to test against each corpus size
    console.log("Generating 100 test candidates...");
    const req: GenerationRequest = {
        requestId: 'scaling_test',
        prompt: 'generate',
        industry: 'SaaS',
        intent: ['speed', 'scale'],
        strategy: 'hybrid',
        availabilityCheck: false
    };

    // We use a dummy availability service just to generate names first
    const dummyDbPath = path.resolve(__dirname, '../../data/dummy.sqlite');
    if (!fs.existsSync(dummyDbPath)) {
        new Database(dummyDbPath).exec(`
            CREATE TABLE IF NOT EXISTS company_normalized (id INTEGER PRIMARY KEY, original_name TEXT, normalized_name TEXT, phonetic_key TEXT);
            CREATE TABLE IF NOT EXISTS domain_cache (id INTEGER PRIMARY KEY, name TEXT, tld TEXT, status TEXT, provider TEXT, checked_at DATETIME, expires_at DATETIME);
            CREATE TABLE IF NOT EXISTS trademark_cache (id INTEGER PRIMARY KEY, name TEXT, jurisdiction TEXT, status TEXT, provider TEXT, checked_at DATETIME, expires_at DATETIME, raw_response TEXT);
        `);
    }
    const dummyCompanyChecker = new SQLiteCompanyChecker(dummyDbPath);
    const dummyService = new AvailabilityService(dummyCompanyChecker, new CachedTrademarkChecker(dummyDbPath, new MockTrademarkProvider()), new CachedDomainChecker(dummyDbPath, new MockDomainProvider()));
    
    const res = await generateNamesEndpoint(req, dummyService, 'free_user');
    const candidates = res.candidates.map((c: any) => c.name);
    console.log(`Generated ${candidates.length} candidates. Starting scale test...\n`);

    for (const size of sizes) {
        const dbPath = path.resolve(__dirname, `../../data/test_corpus_${size}.sqlite`);
        console.log(`Building synthetic corpus: ${size} records...`);
        createSyntheticCorpus(dbPath, size);
        
        const companyChecker = new SQLiteCompanyChecker(dbPath);
        const service = new AvailabilityService(
            companyChecker, 
            new CachedTrademarkChecker(dbPath, new MockTrademarkProvider()), 
            new CachedDomainChecker(dbPath, new MockDomainProvider())
        );

        let highRisk = 0;
        let medRisk = 0;
        let lowRisk = 0;

        for (const name of candidates) {
            const avail = await service.checkAvailability(name, { domains: ['com'], checkTrademarks: false });
            // Since mock trademark and domain are used (and domains no longer throw REGISTERED for < 5),
            // the risk will primarily be driven by the company_checker collisions.
            const risk = avail.companyRisk; 
            
            if (risk >= 0.8) highRisk++;
            else if (risk >= 0.5) medRisk++;
            else lowRisk++;
        }

        const total = candidates.length;
        console.log(`--- RESULTS FOR ${size} CORPORA ---`);
        console.log(`High Risk: ${((highRisk/total)*100).toFixed(1)}%`);
        console.log(`Medium Risk: ${((medRisk/total)*100).toFixed(1)}%`);
        console.log(`Low Risk: ${((lowRisk/total)*100).toFixed(1)}%\n`);
    }
}

if (require.main === module) {
    runCollisionScalingAudit().catch(console.error);
}
