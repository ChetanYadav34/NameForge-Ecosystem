import path from 'path';
import { normalizeName, NormalizationType } from '../availability/normalization';
import { SQLiteCompanyChecker } from '../availability/company_checker';
import { CachedDomainChecker, MockDomainProvider } from '../availability/domain_checker';
import { CachedTrademarkChecker, MockTrademarkProvider } from '../availability/trademark_checker';
import { AvailabilityService } from '../availability/availability_service';
import { generateNamesEndpoint } from '../api/generate';
import { GenerationRequest } from '../generation/types';



describe('Phase 4.3 Availability Intelligence Layer', () => {
    
    test('1. Normalization Pipeline', () => {
        // STRICT
        expect(normalizeName('Shopifyy', NormalizationType.STRICT)).toBe('shopifyy');
        
        // CANONICAL
        expect(normalizeName('Stripe, Inc.', NormalizationType.CANONICAL)).toBe('stripe');
        expect(normalizeName('Shopifyy', NormalizationType.CANONICAL)).toBe('shopifyy');
        expect(normalizeName('OpenAI LLC', NormalizationType.CANONICAL)).toBe('openai');
        
        // FUZZY
        expect(normalizeName('Shopifyy', NormalizationType.FUZZY)).toBe('shopify');
        expect(normalizeName('Appel', NormalizationType.FUZZY)).toBe('apel'); // pp -> p
    });

    describe('Company Conflict Engine', () => {
        const dbPath = path.resolve(__dirname, '../../data/nid.sqlite');
        const checker = new SQLiteCompanyChecker(dbPath);

        test('Stripe -> EXACT_CONFLICT', async () => {
            const res = await checker.checkCompanyConflict('Stripe');
            expect(res.status).toBe('EXACT_CONFLICT');
        });

        test('Strype -> SIMILAR_CONFLICT', async () => {
            const res = await checker.checkCompanyConflict('Strype');
            expect(res.status).toBe('SIMILAR_CONFLICT');
        });

        test('Shopifyy -> SIMILAR_CONFLICT', async () => {
            const res = await checker.checkCompanyConflict('Shopifyy');
            expect(res.status).toBe('SIMILAR_CONFLICT');
        });

        test('Appel -> SIMILAR_CONFLICT', async () => {
            const res = await checker.checkCompanyConflict('Appel');
            expect(res.status).toBe('SIMILAR_CONFLICT');
        });

        test('Ubar -> SIMILAR_CONFLICT', async () => {
            const res = await checker.checkCompanyConflict('Ubar');
            expect(res.status).toBe('SIMILAR_CONFLICT');
        });

        test('QuantumLeaf -> CLEAR_NOT_FOUND', async () => {
            const res = await checker.checkCompanyConflict('QuantumLeaf');
            expect(res.status).toBe('CLEAR_NOT_FOUND');
        });
    });

    describe('Domain & Trademark Checkers', () => {
        const dbPath = path.resolve(__dirname, '../../data/nid.sqlite');
        const domainChecker = new CachedDomainChecker(dbPath, new MockDomainProvider());
        const tmChecker = new CachedTrademarkChecker(dbPath, new MockTrademarkProvider());

        test('Domain: REGISTERED', async () => {
            const res = await domainChecker.checkDomain('Stripe', 'com');
            expect(res.status).toBe('REGISTERED');
        });

        test('Domain: TIMEOUT -> UNKNOWN', async () => {
            const res = await domainChecker.checkDomain('TimeoutTest', 'com');
            expect(res.status).toBe('UNKNOWN');
        });

        test('Trademark: EXACT_CONFLICT', async () => {
            const res = await tmChecker.checkTrademark('Apple');
            expect(res.status).toBe('EXACT_CONFLICT');
        });

        test('Trademark: SIMILAR_CONFLICT', async () => {
            const res = await tmChecker.checkTrademark('Strype');
            expect(res.status).toBe('SIMILAR_CONFLICT');
        });
    });

    describe('FREE vs PAID Capability Boundary', () => {
        const dbPath = path.resolve(__dirname, '../../data/nid.sqlite');
        const companyChecker = new SQLiteCompanyChecker(dbPath);
        const domainChecker = new CachedDomainChecker(dbPath, new MockDomainProvider());
        const tmChecker = new CachedTrademarkChecker(dbPath, new MockTrademarkProvider());
        const service = new AvailabilityService(companyChecker, tmChecker, domainChecker);

        const req: GenerationRequest = {
            requestId: 'test1',
            prompt: 'Generate AI',
            industry: 'AI',
            intent: ['intelligence'],
            strategy: 'industry',
            availabilityCheck: true
        };

        test('FREE User gets NOT_CHECKED', async () => {
            const res = await generateNamesEndpoint(req, service, 'free_user');
            expect(res.candidates.length).toBeGreaterThan(0);
            expect(res.candidates[0].availability.companyConflict.status).toBe('NOT_CHECKED');
        });

        test('PAID User gets Availability Intelligence', async () => {
            const res = await generateNamesEndpoint(req, service, 'paid_user');
            expect(res.candidates.length).toBeGreaterThan(0);
            const status = res.candidates[0].availability.companyConflict.status;
            expect(status !== 'NOT_CHECKED').toBe(true);
        });
    });
});
