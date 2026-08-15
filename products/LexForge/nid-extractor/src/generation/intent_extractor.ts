import Database from 'better-sqlite3';

export interface ExtractedConcept {
    conceptId: number;
    canonicalName: string;
    isIndustryFact: boolean;
    abstractnessScore: number;
}

export function extractIntentConcepts(intentStrings: string[], industryName: string, db: Database.Database): ExtractedConcept[] {
    if (!intentStrings || intentStrings.length === 0) return [];
    
    // Resolve industry ID
    const industryRow = db.prepare(`
        SELECT canonical_id FROM industry_alias WHERE alias_name = ? COLLATE NOCASE
        UNION
        SELECT id FROM industry_ontology WHERE canonical_name = ? COLLATE NOCASE
    `).get(industryName, industryName) as any;
    
    const industryId = industryRow ? (industryRow.canonical_id || industryRow.id) : -1;
    
    // Simple tokenizer
    const tokens = intentStrings
        .join(' ')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(t => t.length > 2 && !['and', 'the', 'for', 'with', 'from', 'that', 'this'].includes(t));
        
    const extracted: ExtractedConcept[] = [];
    const seenIds = new Set<number>();
    
    for (const token of tokens) {
        // Look up concept
        // We use LIKE to find concepts that might be variations (e.g. 'freedom' matches 'freedom')
        const matches = db.prepare(`
            SELECT id, canonical_name 
            FROM concept_catalog 
            WHERE canonical_name = ? OR canonical_name LIKE ?
            LIMIT 5
        `).all(token, `${token}%`) as any[];
        
        for (const match of matches) {
            if (seenIds.has(match.id)) continue;
            seenIds.add(match.id);
            
            // Check industry affinity to distinguish FACT vs INTENT
            let industryAffinity = 0;
            if (industryId !== -1) {
                const mapRow = db.prepare(`
                    SELECT affinity_score FROM concept_industry_map
                    WHERE concept_id = ? AND industry_id = ?
                `).get(match.id, industryId) as any;
                if (mapRow) {
                    industryAffinity = mapRow.affinity_score;
                }
            }
            
            // If affinity is very high, it's an industry fact
            const isIndustryFact = industryAffinity > 0.4; // Threshold for literal industry term
            const abstractnessScore = 1.0 - industryAffinity;
            
            extracted.push({
                conceptId: match.id,
                canonicalName: match.canonical_name,
                isIndustryFact,
                abstractnessScore
            });
        }
    }
    
    // Return sorted by abstractness (most abstract intent first)
    return extracted.sort((a, b) => b.abstractnessScore - a.abstractnessScore);
}
