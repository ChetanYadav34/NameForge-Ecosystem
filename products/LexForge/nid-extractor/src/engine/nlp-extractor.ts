import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const db = new Database(DB_PATH);

// Common English affixes for basic startup naming analysis
const COMMON_SUFFIXES = ['ify', 'ly', 'io', 'ai', 'tech', 'app', 'hub', 'box', 'co', 'ex', 'er', 'in', 'us', 'hq'];
const COMMON_PREFIXES = ['go', 'get', 'my', 'the', 'super', 'pro', 'omni', 'hyper', 'meta', 'neo'];

function countSyllables(word: string): number {
    word = word.toLowerCase();
    if(word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const match = word.match(/[aeiouy]{1,2}/g);
    return match ? match.length : 1;
}

function getPhoneticShape(word: string): string {
    return word.toLowerCase().replace(/[aeiouy]/g, 'V').replace(/[^V]/g, 'C');
}

export function runExtraction() {
    console.log("=== PHASE 3: Naming Structure Extraction ===");
    
    db.exec('BEGIN TRANSACTION');

    const insertAffix = db.prepare(`
        INSERT INTO affix_statistics (affix, type, global_frequency) 
        VALUES (?, ?, 1)
        ON CONFLICT(affix) DO UPDATE SET global_frequency = global_frequency + 1
    `);

    const insertPattern = db.prepare(`
        INSERT OR IGNORE INTO naming_patterns (
            pattern_hash, syllable_count, character_length, vowel_consonant_ratio, phonetic_shape
        ) VALUES (?, ?, ?, ?, ?)
    `);

    const getPatternId = db.prepare(`SELECT id FROM naming_patterns WHERE pattern_hash = ?`);
    const updateCompany = db.prepare(`UPDATE company_raw_data SET extracted_pattern_id = ? WHERE id = ?`);

    const companies = db.prepare(`SELECT id, company_name FROM company_raw_data`).all() as any[];
    
    let processed = 0;
    for (const comp of companies) {
        const name: string = comp.company_name.toLowerCase().replace(/[^a-z]/g, '');
        if (name.length < 2) continue;

        let prefix = null;
        let suffix = null;
        let root = name;

        // Extract Suffix
        for (const suf of COMMON_SUFFIXES) {
            if (name.endsWith(suf) && name.length > suf.length + 2) {
                suffix = suf;
                root = name.slice(0, -suf.length);
                break;
            }
        }

        // Extract Prefix
        for (const pre of COMMON_PREFIXES) {
            if (root.startsWith(pre) && root.length > pre.length + 2) {
                prefix = pre;
                root = root.slice(pre.length);
                break;
            }
        }

        // Record affixes
        if (prefix) insertAffix.run(prefix, 'prefix');
        if (suffix) insertAffix.run(suffix, 'suffix');
        insertAffix.run(root, 'root');

        // Structural metrics
        const chars = name.length;
        const syllables = countSyllables(name);
        const shape = getPhoneticShape(name);
        
        const vowels = (name.match(/[aeiouy]/g) || []).length;
        const consonants = chars - vowels;
        const vcRatio = consonants === 0 ? vowels : Number((vowels / consonants).toFixed(2));

        const patternHash = `${prefix ? prefix + '-' : ''}ROOT${suffix ? '-' + suffix : ''}_${shape}`;

        // Insert pattern
        insertPattern.run(patternHash, syllables, chars, vcRatio, shape);
        
        // Link to company
        const patternRec = getPatternId.get(patternHash) as {id: number};
        if (patternRec) {
            updateCompany.run(patternRec.id, comp.id);
        }

        processed++;
        if (processed % 10000 === 0) console.log(`Processed ${processed} companies...`);
    }

    db.exec('COMMIT');
    console.log(`Extraction complete for ${processed} companies.`);
}

if (require.main === module) {
    runExtraction();
}
