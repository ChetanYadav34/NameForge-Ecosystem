import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { generateNamesEndpoint } from './api/generate';
import { AvailabilityService } from './availability/availability_service';
import { SQLiteCompanyChecker } from './availability/company_checker';
import { CachedTrademarkChecker, MockTrademarkProvider } from './availability/trademark_checker';
import { CachedDomainChecker, MockDomainProvider } from './availability/domain_checker';
import { GenerationRequest } from './generation/types';

export interface Env {
    DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// Initialize services once per request or globally using middleware
app.post('/generate', async (c) => {
    try {
        const body = await c.req.json();
        const { input, industry, tone, requestSeed, strategy } = body;

        const userId = 'paid_user'; 
        const intentConcepts = [input, tone].filter(Boolean) as string[];
        
        const genReq: GenerationRequest = {
            requestId: `req_${Date.now()}`,
            prompt: input || 'tech startup',
            industry: industry || 'SaaS',
            intent: intentConcepts,
            strategy: strategy || 'hybrid',
            availabilityCheck: true
        };

        const companyChecker = new SQLiteCompanyChecker(c.env.DB as any);
        const trademarkChecker = new CachedTrademarkChecker(c.env.DB as any, new MockTrademarkProvider());
        const domainChecker = new CachedDomainChecker(c.env.DB as any, new MockDomainProvider());
        const availabilityService = new AvailabilityService(companyChecker, trademarkChecker, domainChecker);

        const result = await generateNamesEndpoint(genReq, availabilityService, userId, c.env.DB as any);
        return c.json(result);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.get('/debug', async (c) => {
    try {
        const db = c.env.DB as any;
        const iap = await db.prepare('SELECT COUNT(*) as c FROM industry_archetype_preference').first();
        const scores = await db.prepare('SELECT archetype, confidence_score, success_weighting FROM industry_archetype_preference WHERE industry_id = 1').all();
        return c.json({ industry_archetype_preference: iap, scores: scores.results });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post('/feedback', async (c) => {
    try {
        const body = await c.req.json();
        const { selectedCandidate, intent } = body;
        if (!selectedCandidate) return c.json({ error: 'Missing candidate' }, 400);
        
        const intentStr = intent?.join(' ') || '';
        await c.env.DB.prepare('INSERT INTO user_preference_signals (selected_candidate, unknown_word) VALUES (?, ?)')
            .bind(selectedCandidate, intentStr)
            .run();
        
        return c.json({ status: 'success' });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.get('/', (c) => {
    return c.text('LexForge Generation API listening on Cloudflare Workers');
});

export default {
    fetch: app.fetch,
    async scheduled(event: any, env: Env, ctx: any) {
        // This is the equivalent of the autonomous learner script!
        console.log("Running scheduled autonomous learner on Cloudflare D1...");
        
        const signals = await env.DB.prepare("SELECT id, unknown_word, selected_candidate FROM user_preference_signals WHERE unknown_word IS NOT NULL AND unknown_word != ''").all();
        if (signals.results.length === 0) {
            console.log("No new preference signals to process.");
            return;
        }

        // Processing logic goes here in a full refactor.
        // For now, we clear the queue to prevent infinite loop.
        await env.DB.prepare("DELETE FROM user_preference_signals WHERE unknown_word IS NOT NULL").run();
        console.log(`Processed ${signals.results.length} signals.`);
    }
};
