import { 
    AvailabilityService as IAvailabilityService, 
    CompanyConflictChecker, 
    DomainChecker, 
    TrademarkChecker, 
    AvailabilityResult 
} from './types';

function computeRisk(result: AvailabilityResult): number {
    switch (result.status) {
        case 'EXACT_CONFLICT':
        case 'REGISTERED':
            return 1.0;
        case 'SIMILAR_CONFLICT':
            return result.confidence || 0.8;
        case 'POSSIBLE_CONFLICT':
        case 'PREMIUM':
            return 0.5;
        case 'UNKNOWN':
        case 'ERROR':
            return 0.3; // Slight penalty for uncertainty
        case 'CLEAR_NOT_FOUND':
        case 'AVAILABLE':
        case 'NOT_CHECKED':
            return 0.0;
        default:
            return 0.0;
    }
}

export class AvailabilityService implements IAvailabilityService {
    constructor(
        private companyChecker: CompanyConflictChecker,
        private trademarkChecker: TrademarkChecker,
        private domainChecker: DomainChecker
    ) {}

    async checkAvailability(candidate: string, config: { domains: string[], checkTrademarks: boolean }) {
        const [company, trademark, ...domains] = await Promise.all([
            this.companyChecker.checkCompanyConflict(candidate),
            config.checkTrademarks 
                ? this.trademarkChecker.checkTrademark(candidate) 
                : Promise.resolve({ status: 'NOT_CHECKED', confidence: 0, provider: 'none', checkedAt: new Date() } as AvailabilityResult),
            ...config.domains.map(tld => this.domainChecker.checkDomain(candidate, tld))
        ]);

        const domainResults: Record<string, AvailabilityResult> = {};
        let maxDomainRisk = 0;
        let checkedDomainCount = 0;

        config.domains.forEach((tld, idx) => {
            domainResults[tld] = domains[idx];
            if (domains[idx].status !== 'NOT_CHECKED') {
                const r = computeRisk(domains[idx]);
                if (r > maxDomainRisk) maxDomainRisk = r;
                checkedDomainCount++;
            }
        });

        const companyRisk = computeRisk(company);
        const trademarkRisk = computeRisk(trademark);
        
        // If no domains were checked (or all not checked), don't penalize domainRisk
        const domainRisk = checkedDomainCount > 0 ? maxDomainRisk : 0.0;

        // Overall risk is weighted max or average. 
        // A single EXACT_CONFLICT (1.0) in trademark or company ruins the name.
        const overallAvailabilityRisk = Math.max(companyRisk, trademarkRisk, domainRisk);

        return {
            company,
            trademark,
            domain: domainResults,
            companyRisk,
            trademarkRisk,
            domainRisk,
            overallAvailabilityRisk
        };
    }
}
