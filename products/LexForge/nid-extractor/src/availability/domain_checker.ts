export type Database = any;
import { DomainChecker, AvailabilityResult } from './types';

export class CachedDomainChecker implements DomainChecker {
    private db: Database;
    private provider: DomainChecker;

    constructor(db: Database, provider: DomainChecker) {
        this.db = db;
        this.provider = provider;
    }

    async checkDomain(name: string, tld: string): Promise<AvailabilityResult> {
        const now = new Date();
        const cached = await this.db.prepare(`
            SELECT status, provider, checked_at, expires_at 
            FROM domain_cache 
            WHERE name = ? AND tld = ?
        `).bind(name, tld).first() as any;

        if (cached && cached.expires_at) {
            const expires = new Date(cached.expires_at);
            if (expires > now) {
                return {
                    status: cached.status,
                    confidence: 1.0, // Cached exact
                    provider: `cache (${cached.provider})`,
                    checkedAt: new Date(cached.checked_at)
                };
            }
        }

        // Cache miss or expired, call provider
        try {
            const result = await this.provider.checkDomain(name, tld);
            
            // Only cache valid statuses, not UNKNOWN or ERROR unless specifically desired, 
            // but we shouldn't aggressively cache failures for a full 24h.
            // For now, let's cache non-errors for 24h.
            if (result.status !== 'UNKNOWN' && result.status !== 'ERROR') {
                const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
                
                await this.db.prepare(`
                    INSERT INTO domain_cache (name, tld, status, provider, checked_at, expires_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON CONFLICT(name, tld) DO UPDATE SET 
                        status=excluded.status, 
                        provider=excluded.provider, 
                        checked_at=excluded.checked_at, 
                        expires_at=excluded.expires_at
                `).bind(name, tld, result.status, result.provider, now.toISOString().run(), expiresAt.toISOString());
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

export class MockDomainProvider implements DomainChecker {
    async checkDomain(name: string, tld: string): Promise<AvailabilityResult> {
        // Simulate network delay
        await new Promise(res => setTimeout(res, 50));
        
        // Deterministic mock behavior for testing
        const lower = name.toLowerCase();
        let status: AvailabilityResult['status'] = 'AVAILABLE';
        
        // Just hardcode a few test cases
        if (lower === 'stripe' || lower === 'apple' || lower === 'uber') {
            status = 'REGISTERED';
        } else if (lower === 'premiumname') {
            status = 'PREMIUM';
        } else if (lower === 'timeouttest') {
            status = 'UNKNOWN'; // Simulate timeout
        }

        return {
            status,
            confidence: 1.0,
            provider: 'mock_domain_provider',
            checkedAt: new Date()
        };
    }
}
