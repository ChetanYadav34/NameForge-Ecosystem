import express from 'express';
import cors from 'cors';
import path from 'path';
import Database from 'better-sqlite3';
import fs from 'fs';
import { generateNamesEndpoint } from './api/generate';
import { AvailabilityService } from './availability/availability_service';
import { SQLiteCompanyChecker } from './availability/company_checker';
import { CachedTrademarkChecker, MockTrademarkProvider } from './availability/trademark_checker';
import { CachedDomainChecker, MockDomainProvider } from './availability/domain_checker';
import { GenerationRequest } from './generation/types';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Initialize Availability Service
const dbPath = path.resolve(__dirname, '../data/dummy.sqlite');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

new Database(dbPath).exec(`
    DROP TABLE IF EXISTS domain_cache;
    DROP TABLE IF EXISTS trademark_cache;
    CREATE TABLE IF NOT EXISTS company_normalized (id INTEGER PRIMARY KEY, original_name TEXT, normalized_name TEXT, phonetic_key TEXT);
    CREATE TABLE domain_cache (id INTEGER PRIMARY KEY, name TEXT, tld TEXT, status TEXT, provider TEXT, checked_at DATETIME, expires_at DATETIME, UNIQUE(name, tld));
    CREATE TABLE trademark_cache (id INTEGER PRIMARY KEY, name TEXT, jurisdiction TEXT, status TEXT, provider TEXT, checked_at DATETIME, expires_at DATETIME, raw_response TEXT, UNIQUE(name, jurisdiction));
`);

const companyChecker = new SQLiteCompanyChecker(dbPath);
const trademarkChecker = new CachedTrademarkChecker(dbPath, new MockTrademarkProvider());
const domainChecker = new CachedDomainChecker(dbPath, new MockDomainProvider());
const availabilityService = new AvailabilityService(companyChecker, trademarkChecker, domainChecker);

app.post('/generate', async (req, res) => {
    try {
        const { input, industry, tone, requestSeed } = req.body;

        // Default to a paid user with availability checking enabled for the demo
        const userId = 'paid_user'; 
        const genReq: GenerationRequest = {
            requestId: `req_${Date.now()}`,
            prompt: input || 'tech startup',
            industry: industry || 'SaaS',
            intent: [tone || 'modern'],
            strategy: 'hybrid',
            availabilityCheck: true
        };

        const result = await generateNamesEndpoint(genReq, availabilityService, userId);
        res.json(result);
    } catch (error) {
        console.error('Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate names' });
    }
});

app.listen(PORT, () => {
    console.log(`LexForge Generation API listening on http://localhost:${PORT}`);
});
