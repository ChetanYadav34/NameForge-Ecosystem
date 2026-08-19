export type Database = any;

export interface ExtractedConcept {
    conceptId: number;
    canonicalName: string;
    isIndustryFact: boolean;
    abstractnessScore: number;
}

export interface IntentExtractionResult {
    concepts: ExtractedConcept[];
    unmatchedTokens: string[];
}

export async function extractIntentConcepts(intentStrings: string[], industryName: string, db: Database): Promise<IntentExtractionResult> {
    if (!intentStrings || intentStrings.length === 0) return { concepts: [], unmatchedTokens: [] };
    
    // Resolve industry ID
    const industryRow = await db.prepare(`
        SELECT canonical_id FROM industry_alias WHERE alias_name = ? COLLATE NOCASE
        UNION
        SELECT id FROM industry_ontology WHERE canonical_name = ? COLLATE NOCASE
    `).bind(industryName, industryName).first() as any;
    
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
    const unmatchedTokens: string[] = [];
    
    for (const rawToken of tokens) {
        let token = rawToken;
        
        // Very basic hardcoded typo correction for common user mistakes in intent
        const typoMap: Record<string, string> = {
            'carzy': 'crazy',
            'tehc': 'tech',
            'sofware': 'software',
            'innvation': 'innovation',
            'creatoin': 'creation'
        };
        if (typoMap[token]) token = typoMap[token];
        
        // Stemming variants to try if direct match fails
        const variants = [token];
        if (token.endsWith('s')) variants.push(token.slice(0, -1));
        if (token.endsWith('ing')) variants.push(token.slice(0, -3));
        if (token.endsWith('er')) variants.push(token.slice(0, -2));
        if (token.endsWith('ed')) variants.push(token.slice(0, -2));

        let matches: any[] = [];
        
        for (const variant of variants) {
            // Look up concept
            matches = (await db.prepare(`
                SELECT id, canonical_name 
                FROM concept_catalog 
                WHERE canonical_name = ? OR canonical_name LIKE ?
                LIMIT 5
            `).bind(variant, `${variant}%`).all()).results as any[];
            
            if (matches.length > 0) break; // Found matches with this variant
        }
        
        if (matches.length === 0) {
            unmatchedTokens.push(rawToken); // push original
            
            // Add to discovery queue for the autonomous learner
            try {
                await db.prepare('INSERT INTO concept_discovery_queue (unknown_word, context) VALUES (?, ?)').bind(rawToken, intentStrings.join(' ')).run();
            } catch (e) {
                console.error("Discovery queue log failed:", e);
            }
        }
        
        for (const match of matches) {
            if (seenIds.has(match.id)) continue;
            seenIds.add(match.id);
            
            // Check industry affinity to distinguish FACT vs INTENT
            let industryAffinity = 0;
            if (industryId !== -1) {
                const mapRow = await db.prepare(`
                    SELECT affinity_score FROM concept_industry_map
                    WHERE concept_id = ? AND industry_id = ?
                `).bind(match.id, industryId).first() as any;
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
    return {
        concepts: extracted.sort((a, b) => b.abstractnessScore - a.abstractnessScore),
        unmatchedTokens
    };
}
