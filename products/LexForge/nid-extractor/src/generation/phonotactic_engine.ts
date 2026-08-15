import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
let dbInstance: Database.Database | null = null;

function getDB() {
    if (!dbInstance) {
        dbInstance = new Database(DB_PATH);
    }
    return dbInstance;
}

export interface PhonotacticResult {
    pronounceabilityScore: number;
    readabilityScore: number;
    syllableCount: number;
    phoneticShape: string;
    issues: string[];
}

export function analyzePhonotactics(requestId: string, candidate: string): PhonotacticResult {
    const str = candidate.toLowerCase();
    const issues: string[] = [];
    
    // 1. Phonetic Shape (CV Pattern)
    let shape = '';
    for (const char of str) {
        if (/[aeiouy]/.test(char)) {
            shape += 'V';
        } else if (/[a-z]/.test(char)) {
            shape += 'C';
        }
    }
    
    // 2. Syllable Estimation
    // Rough estimate: count vowel groups, subtract silent 'e' at end
    const vowelGroups = str.match(/[aeiouy]+/g);
    let syllables = vowelGroups ? vowelGroups.length : 0;
    if (str.endsWith('e') && syllables > 1 && !/[aeiouy]e$/.test(str)) {
        syllables--;
    }
    if (syllables === 0) syllables = 1;

    // 3. Pronounceability Score
    let pronounceability = 1.0;
    
    // Penalize long consonant clusters
    if (/C{3,}/.test(shape)) {
        pronounceability -= 0.3;
        issues.push('LONG_CONSONANT_CLUSTER');
    }
    
    // Penalize long vowel clusters
    if (/V{3,}/.test(shape)) {
        pronounceability -= 0.2;
        issues.push('LONG_VOWEL_CLUSTER');
    }

    // 4. Readability Score
    let readability = 1.0;
    
    // Reward balanced CV alternating
    if (/CVCVCV|VCVCVC/.test(shape)) {
        readability += 0.2;
    }
    
    // Penalize if too many syllables for its length (cramped)
    if (syllables > 4 && str.length < 8) {
        readability -= 0.2;
    }

    pronounceability = Math.max(0, Math.min(1, pronounceability));
    readability = Math.max(0, Math.min(1, readability));

    // Persist
    const db = getDB();
    db.prepare(`INSERT INTO phonotactic_scores (request_id, candidate_string, pronounceability_score, readability_score, syllable_count, phonetic_shape, issues) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
        requestId, candidate, pronounceability, readability, syllables, shape, JSON.stringify(issues)
    );

    return {
        pronounceabilityScore: pronounceability,
        readabilityScore: readability,
        syllableCount: syllables,
        phoneticShape: shape,
        issues
    };
}
