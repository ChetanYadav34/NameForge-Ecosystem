export type Database = any;
import { GenerationRequest, ArchetypeScore } from './types';

export async function routeArchetype(req: GenerationRequest, db: Database): Promise<ArchetypeScore[]> {
    // Resolve canonical industry
    const indRow = await db.prepare(`
        SELECT canonical_id FROM industry_alias WHERE alias_name = ? COLLATE NOCASE
        UNION
        SELECT id FROM industry_ontology WHERE canonical_name = ? COLLATE NOCASE
    `).bind(req.industry, req.industry).first() as any;
    
    let industryId = indRow ? (indRow.canonical_id || indRow.id) : null;
    
    if (!industryId) {
        // Fallback or Unknown
        industryId = 1; // HACK: just default to the first one for simulation if unknown
    }

    // Retrieve preferences for this industry
    const prefs = (await db.prepare(`SELECT archetype, confidence_score, success_weighting FROM industry_archetype_preference WHERE industry_id = ?`).bind(industryId).all()).results as any[];
    
    // Adjust scores based on style references if applicable
    let scores: ArchetypeScore[] = prefs.map(p => {
        let confidence = p.confidence_score;
        let weight = p.success_weighting;
        
        // E.g., if user asks for "Apple-like", boost "Abstract Coined"
        if (req.styleReferences) {
            const styles = req.styleReferences.map(s => s.toLowerCase());
            if (styles.includes('apple-like') && p.archetype === 'Abstract Coined') {
                confidence += 0.2;
                weight += 0.2;
            }
            if (styles.includes('stripe-like') && p.archetype === 'Dictionary / Semantic') {
                confidence += 0.2;
                weight += 0.2;
            }
            if (styles.includes('shopify-like') && p.archetype === 'Root + Suffix') {
                confidence += 0.2;
                weight += 0.2;
            }
            if (styles.includes('pinterest-like') && p.archetype === 'Portmanteau') {
                confidence += 0.2;
                weight += 0.2;
            }
        }
        
        return {
            archetype: p.archetype,
            confidence: Math.min(confidence, 1.0),
            weight: weight,
            rank: 0
        };
    });

    // Sort by confidence * weight descending
    scores.sort((a, b) => (b.confidence * b.weight) - (a.confidence * a.weight));
    
    // Assign ranks
    scores.forEach((s, idx) => { s.rank = idx + 1; });
    
    return scores;
}
