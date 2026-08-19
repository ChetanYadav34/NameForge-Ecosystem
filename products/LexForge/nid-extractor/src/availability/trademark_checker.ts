export type Database = any;
import { TrademarkChecker, AvailabilityResult } from './types';

export class CachedTrademarkChecker implements TrademarkChecker {
    private db: Database;
    private provider: TrademarkChecker;

    constructor(db: Database, provider: TrademarkChecker) {
        this.db = db;
        this.provider = provider;
    }

    async checkTrademark(name: string, jurisdiction: string = 'US'): Promise<AvailabilityResult> {
        const now = new Date();
        const cached = await this.db.prepare(`
            SELECT status, provider, checked_at, expires_at, raw_response 
            FROM trademark_cache 
            WHERE name = ? AND jurisdiction = ?
        `).bind(name, jurisdiction).first() as any;

        if (cached && cached.expires_at) {
            const expires = new Date(cached.expires_at);
            if (expires > now) {
                return {
                    status: cached.status,
                    confidence: 1.0,
                    provider: `cache (${cached.provider})`,
                    checkedAt: new Date(cached.checked_at),
                    details: cached.raw_response ? JSON.parse(cached.raw_response) : undefined
                };
            }
        }

        try {
            const result = await this.provider.checkTrademark(name, jurisdiction);
            
            if (result.status !== 'UNKNOWN' && result.status !== 'ERROR') {
                const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
                
                await this.db.prepare(`
                    INSERT INTO trademark_cache (name, jurisdiction, status, provider, raw_response, checked_at, expires_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(name, jurisdiction) DO UPDATE SET 
                        status=excluded.status, 
                        provider=excluded.provider, 
                        raw_response=excluded.raw_response,
                        checked_at=excluded.checked_at, 
                        expires_at=excluded.expires_at
                `).bind(
                    name, 
                    jurisdiction, 
                    result.status, 
                    result.provider, 
                    result.details ? JSON.stringify(result.details).run() : null,
                    now.toISOString(), 
                    expiresAt.toISOString()
                );
            }

            return result;
        } catch (e) {
            return {
                status: 'UNKNOWN',
                confidence: 0,
                provider: 'error_fallback',
                checkedAt: now,
                details: { error: String(e) }
            };
        }
    }
}

export class MockTrademarkProvider implements TrademarkChecker {
    async checkTrademark(name: string, jurisdiction: string = 'US'): Promise<AvailabilityResult> {
        // Simulate network delay
        await new Promise(res => setTimeout(res, 100));
        
        const lower = name.toLowerCase();
        let status: AvailabilityResult['status'] = 'CLEAR_NOT_FOUND';
        let details: any = {};
        
        if (lower === 'stripe' || lower === 'apple' || lower === 'uber') {
            status = 'EXACT_CONFLICT';
            details = { match: name, class: 'Software' };
        } else if (lower === 'strype' || lower === 'shopifyy' || lower === 'appel' || lower === 'ubar') {
            status = 'SIMILAR_CONFLICT';
            details = { match: 'Similar active trademark found' };
        } else if (lower === 'timeouttest') {
            status = 'UNKNOWN';
        }

        return {
            status,
            confidence: 0.9,
            provider: 'mock_trademark_provider',
            checkedAt: new Date(),
            details
        };
    }
}
