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
        const { input, industry, tone, requestSeed, strategy } = req.body;

        // Default to a paid user with availability checking enabled for the demo
        const userId = 'paid_user'; 
        
        // Combine the user's explicit input vision with the selected tone
        const intentConcepts = [input, tone].filter(Boolean) as string[];
        
        const genReq: GenerationRequest = {
            requestId: `req_${Date.now()}`,
            prompt: input || 'tech startup',
            industry: industry || 'SaaS',
            intent: intentConcepts,
            strategy: strategy || 'hybrid',
            availabilityCheck: true
        };

        const result = await generateNamesEndpoint(genReq, availabilityService, userId);
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/feedback', async (req, res) => {
    try {
        const { selectedCandidate, intent } = req.body;
        if (!selectedCandidate) return res.status(400).json({ error: 'Missing candidate' });
        
        // Find unknown words from intent
        // In a full implementation, the UI would track which exact word was unknown,
        // but here we can just log the whole intent for the learner to parse
        const mainDbPath = path.resolve(__dirname, '../data/nid.sqlite');
        const db = new Database(mainDbPath);
        db.prepare('INSERT INTO user_preference_signals (selected_candidate, unknown_word) VALUES (?, ?)').run(selectedCandidate, intent?.join(' ') || '');
        
        res.json({ status: 'success' });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

import { exec } from 'child_process';

// For demonstration, serve some static/mock frontend if needed
app.get('/', (req, res) => {
    res.send(`LexForge Generation API listening on http://localhost:${PORT}`);
});

app.listen(PORT, () => {
    console.log(`LexForge Generation API listening on port ${PORT}`);
    
    // Automate the learner to run every 1 hour
    const LEARNER_INTERVAL = 60 * 60 * 1000;
    setInterval(() => {
        console.log('Running automated background learner...');
        exec('npm run learn', { cwd: __dirname + '/..' }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Automated Learner Error: ${error.message}`);
                return;
            }
            if (stderr) console.error(`Learner Stderr: ${stderr}`);
            console.log(`Learner Output:\n${stdout}`);
        });
    }, LEARNER_INTERVAL);
});
