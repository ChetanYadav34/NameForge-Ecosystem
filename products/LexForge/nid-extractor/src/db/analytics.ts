import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const db = new Database(DB_PATH);

export function runAnalytics() {
    console.log("=== PHASE 3 Analytics ===");

    console.log("\n1. Top 5 Prefixes:");
    const prefs = db.prepare(`SELECT affix, global_frequency FROM affix_statistics WHERE type='prefix' ORDER BY global_frequency DESC LIMIT 5`).all() as any[];
    prefs.forEach(p => console.log(`   - ${p.affix}: ${p.global_frequency}`));

    console.log("\n2. Top 5 Suffixes:");
    const sufs = db.prepare(`SELECT affix, global_frequency FROM affix_statistics WHERE type='suffix' ORDER BY global_frequency DESC LIMIT 5`).all() as any[];
    sufs.forEach(p => console.log(`   - ${p.affix}: ${p.global_frequency}`));

    console.log("\n3. Top 10 Morpheme Roots:");
    const roots = db.prepare(`SELECT affix, global_frequency FROM affix_statistics WHERE type='root' ORDER BY global_frequency DESC LIMIT 10`).all() as any[];
    roots.forEach(p => console.log(`   - ${p.affix}: ${p.global_frequency}`));

    console.log("\n4. Most Common Phonetic Shapes:");
    const shapes = db.prepare(`SELECT phonetic_shape, COUNT(*) as c FROM naming_patterns GROUP BY phonetic_shape ORDER BY c DESC LIMIT 5`).all() as any[];
    shapes.forEach(p => console.log(`   - ${p.phonetic_shape}: ${p.c} patterns`));

    console.log("\n5. Pattern Frequency Distribution (Top 5):");
    const patterns = db.prepare(`
        SELECT p.pattern_hash, COUNT(c.id) as freq 
        FROM naming_patterns p
        JOIN company_raw_data c ON c.extracted_pattern_id = p.id
        GROUP BY p.id
        ORDER BY freq DESC LIMIT 5
    `).all() as any[];
    patterns.forEach(p => console.log(`   - ${p.pattern_hash}: used by ${p.freq} companies`));

    console.log("\n6. Example Industry-Specific Pattern (Fintech):");
    const fintech = db.prepare(`
        SELECT p.pattern_hash, COUNT(c.id) as freq
        FROM naming_patterns p
        JOIN company_raw_data c ON c.extracted_pattern_id = p.id
        WHERE c.industry_raw LIKE '%Fintech%'
        GROUP BY p.id
        ORDER BY freq DESC LIMIT 5
    `).all() as any[];
    fintech.forEach(p => console.log(`   - ${p.pattern_hash}: used by ${p.freq} Fintech companies`));
}

if (require.main === module) {
    runAnalytics();
}
