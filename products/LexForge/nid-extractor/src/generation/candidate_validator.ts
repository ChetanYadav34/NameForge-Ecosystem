export type Database = any;







export interface ValidationResult {
    isValid: boolean;
    failures: string[];
    validationScore: number;
}

// Common dictionary fragments that should not stand alone without a suffix/prefix
const FRAGMENTS = ['healt', 'financ', 'techn', 'analyt', 'softw', 'educ', 'med', 'serv'];

export async function validateCandidate(requestId: string, candidate: string, db: Database): Promise<ValidationResult> {
    const failures: string[] = [];
    let score = 1.0;
    const str = candidate.toLowerCase();
    
    // 1. Length bounds
    if (str.length < 4) {
        failures.push('TOO_SHORT');
    }
    if (str.length > 14) {
        failures.push('TOO_LONG');
    }

    // 2. Vowel ratio
    const vowels = str.match(/[aeiouy]/g);
    const vowelCount = vowels ? vowels.length : 0;
    const vowelRatio = vowelCount / str.length;
    
    if (vowelRatio < 0.2) {
        failures.push('LOW_VOWEL_RATIO');
    }
    if (vowelRatio > 0.8) {
        failures.push('HIGH_VOWEL_RATIO');
    }

    // 3. Incomplete fragments
    for (const frag of FRAGMENTS) {
        if (str === frag) {
            failures.push('DICTIONARY_FRAGMENT');
        }
    }

    // 4. Entropy / Repeated Characters
    let maxRepeat = 1;
    let currRepeat = 1;
    for (let i = 1; i < str.length; i++) {
        if (str[i] === str[i-1]) {
            currRepeat++;
            if (currRepeat > maxRepeat) maxRepeat = currRepeat;
        } else {
            currRepeat = 1;
        }
    }
    if (maxRepeat > 2) {
        failures.push('REPEATED_CHARACTERS');
    }

    // 5. Soft Consonant Penalties
    // Triple consonants are penalized but not outright rejected unless impossible
    const hardClusters = ['q', 'x', 'z', 'j', 'v']; // generic hard consonants
    const tripleConsonants = str.match(/[^aeiouy]{3}/g);
    
    if (tripleConsonants) {
        for (const cluster of tripleConsonants) {
            let hardCount = 0;
            for (const char of cluster) {
                if (hardClusters.includes(char)) hardCount++;
            }
            if (hardCount > 0) {
                // If the triple cluster contains a hard consonant, reject it
                failures.push('IMPOSSIBLE_CONSONANT_CLUSTER');
            } else {
                // Soft penalty for general triple consonants
                score -= 0.15;
            }
        }
    }

    // Also reject leading/trailing clusters that are unpronounceable
    if (/^[^aeiouy]{3}/.test(str) || /[^aeiouy]{3}$/.test(str)) {
        failures.push('IMPOSSIBLE_CONSONANT_CLUSTER');
    }

    const isValid = failures.length === 0;

    // Persist
    try {
        await db.prepare(`INSERT INTO candidate_validation (request_id, candidate_string, is_valid, failures, validation_score) VALUES (?, ?, ?, ?, ?)`).bind(
            requestId, candidate, isValid ? 1 : 0, JSON.stringify(failures), score
        ).run();
    } catch (e) {
        // ignore duplicate
    }

    return {
        isValid,
        failures,
        validationScore: score
    };
}
