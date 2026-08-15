import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const db = new Database(DB_PATH);

const MIN_SUPPORT = 10;
const MIN_NGRAM_LEN = 2;
const MAX_NGRAM_LEN = 6;

export function runPhase35() {
    console.log("=== Phase 3.5: Dynamic Morpheme Discovery ===");

    // We only train on v_training_corpus
    const companies = db.prepare(`SELECT id, company_name, valuation_tier FROM v_training_corpus`).all() as any[];
    
    // In-memory maps for fast N-Gram counting
    const ngramCounts = new Map<string, { type: string, count: number, totalWeight: number, companyIds: Set<number> }>();
    
    console.log(`Processing ${companies.length} training companies...`);

    for (const comp of companies) {
        const name: string = comp.company_name.toLowerCase().replace(/[^a-z]/g, '');
        if (name.length < 2) continue;
        
        const weight = comp.valuation_tier || 1.0;
        
        const seenNgrams = new Set<string>();

        // Generate N-grams
        for (let len = MIN_NGRAM_LEN; len <= MAX_NGRAM_LEN; len++) {
            for (let i = 0; i <= name.length - len; i++) {
                const ngram = name.substring(i, i + len);
                
                if (seenNgrams.has(ngram)) continue; // Only count once per company
                seenNgrams.add(ngram);

                let type = 'stem';
                if (i === 0) type = 'prefix';
                else if (i === name.length - len) type = 'suffix';
                // If it is the entire string, treat as root/stem
                if (i === 0 && len === name.length) type = 'root';

                const key = `${ngram}_${type}`;
                
                if (!ngramCounts.has(key)) {
                    ngramCounts.set(key, { type, count: 0, totalWeight: 0, companyIds: new Set() });
                }
                const entry = ngramCounts.get(key)!;
                entry.count++;
                entry.totalWeight += weight;
                entry.companyIds.add(comp.id);
            }
        }
    }

    console.log(`Generated ${ngramCounts.size} unique n-gram combinations. Pruning...`);

    // Prune below MIN_SUPPORT
    const validMorphemes = Array.from(ngramCounts.entries())
        .filter(([_, stats]) => stats.count >= MIN_SUPPORT);
        
    console.log(`Retained ${validMorphemes.length} morphemes above support threshold.`);

    // Aggregate by morpheme string to avoid UNIQUE constraint violation
    const morphemeStats = new Map<string, { typeCounts: Map<string, number>, count: number, totalWeight: number, companyIds: Map<number, string> }>();

    for (const [key, stats] of validMorphemes) {
        const [morphemeStr, type] = key.split('_');
        if (!morphemeStats.has(morphemeStr)) {
            morphemeStats.set(morphemeStr, { typeCounts: new Map(), count: 0, totalWeight: 0, companyIds: new Map() });
        }
        const entry = morphemeStats.get(morphemeStr)!;
        
        entry.typeCounts.set(type, (entry.typeCounts.get(type) || 0) + stats.count);
        entry.count += stats.count;
        entry.totalWeight += stats.totalWeight;
        
        for (const cid of stats.companyIds) {
            entry.companyIds.set(cid, type); // Last writer wins for type on this company
        }
    }

    console.log(`Aggregated into ${morphemeStats.size} unique morphemes.`);

    db.exec('BEGIN TRANSACTION');
    
    const insertMorpheme = db.prepare(`
        INSERT INTO morpheme_catalog (morpheme, detected_type, global_frequency, success_weighting, uniqueness_score) 
        VALUES (?, ?, ?, ?, ?)
    `);

    const insertMap = db.prepare(`
        INSERT INTO company_morpheme_map (company_id, morpheme_id, position)
        VALUES (?, ?, ?)
    `);

    const totalCompanies = companies.length;

    let inserted = 0;
    for (const [morphemeStr, stats] of morphemeStats) {
        const avgWeight = stats.totalWeight / stats.count;
        const idf = Math.log(totalCompanies / stats.count);
        
        // Find dominant type
        let dominantType = 'stem';
        let maxCount = -1;
        for (const [t, c] of stats.typeCounts) {
            if (c > maxCount) { maxCount = c; dominantType = t; }
        }

        const info = insertMorpheme.run(morphemeStr, dominantType, stats.count, avgWeight, idf);
        const morphemeId = info.lastInsertRowid;

        for (const [cid, position] of stats.companyIds) {
            insertMap.run(cid, morphemeId, position);
        }
        inserted++;
    }

    db.exec('COMMIT');
    console.log(`Successfully populated morpheme_catalog with ${inserted} high-quality morphemes.`);
}

if (require.main === module) {
    runPhase35();
}
