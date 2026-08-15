import { GenerationRequest, NamingStrategy } from './types';

export function resolveNamingStrategy(req: GenerationRequest): NamingStrategy {
    if (req.strategy) {
        return req.strategy;
    }
    
    const hasIndustry = Boolean(req.industry && req.industry.trim() !== '');
    const hasIntent = Boolean(req.intent && req.intent.length > 0);
    
    if (hasIndustry && hasIntent) return 'hybrid';
    if (hasIntent) return 'intent';
    return 'industry';
}
