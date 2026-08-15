import Database from 'better-sqlite3';
import path from 'path';
import { GenerationRequest, ArchetypeScore } from './types';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
let dbInstance: Database.Database | null = null;

function getDB() {
    if (!dbInstance) {
        dbInstance = new Database(DB_PATH, { readonly: true });
    }
    return dbInstance;
}

export function routeArchetype(req: GenerationRequest): ArchetypeScore[] {
    const db = getDB();
    
    // Resolve canonical industry
    const getIndustryId = db.prepare(`
        SELECT canonical_id FROM industry_alias WHERE alias_name = ? COLLATE NOCASE
        UNION
        SELECT id FROM industry_ontology WHERE canonical_name = ? COLLATE NOCASE
    `);
    
    let indRow = getIndustryId.get(req.industry, req.industry) as any;
    let industryId = indRow ? (indRow.canonical_id || indRow.id) : null;
    
    if (!industryId) {
        // Fallback or Unknown
        industryId = 1; // HACK: just default to the first one for simulation if unknown
    }

    // Retrieve preferences for this industry
    const prefs = db.prepare(`SELECT archetype, confidence_score, success_weighting FROM industry_archetype_preference WHERE industry_id = ?`).all(industryId) as any[];
    
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
