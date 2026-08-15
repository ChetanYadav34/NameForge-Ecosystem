export interface AvailabilityResult {
    status: 'AVAILABLE' | 'REGISTERED' | 'PREMIUM' | 'EXACT_CONFLICT' | 'SIMILAR_CONFLICT' | 'POSSIBLE_CONFLICT' | 'CLEAR_NOT_FOUND' | 'UNKNOWN' | 'ERROR' | 'NOT_CHECKED';
    confidence: number;
    provider: string;
    checkedAt: Date;
    details?: any;
}

export interface DomainChecker {
    checkDomain(name: string, tld: string): Promise<AvailabilityResult>;
}

export interface TrademarkChecker {
    checkTrademark(name: string, jurisdiction?: string): Promise<AvailabilityResult>;
}

export interface CompanyConflictChecker {
    checkCompanyConflict(name: string): Promise<AvailabilityResult>;
}

export interface AvailabilityService {
    checkAvailability(candidate: string, config: { domains: string[], checkTrademarks: boolean }): Promise<{
        domain: Record<string, AvailabilityResult>;
        trademark: AvailabilityResult;
        company: AvailabilityResult;
        companyRisk: number;
        trademarkRisk: number;
        domainRisk: number;
        overallAvailabilityRisk: number;
    }>;
}
