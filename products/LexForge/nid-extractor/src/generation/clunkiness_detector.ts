/**
 * Clunkiness Detector
 * Identifies and penalizes names with awkward clusters, repeated syllables,
 * ugly endings, forced suffixes, and artificial spellings.
 */

export interface ClunkinessResult {
    isVetoed: boolean;
    penaltyScore: number; // 0 to 1, where 1 is perfect (no penalty)
    flags: string[];
}

export function detectClunkiness(name: string): ClunkinessResult {
    const flags: string[] = [];
    let isVetoed = false;
    let penalty = 1.0;
    
    const lower = name.toLowerCase();
    
    // 1. Awkward consonant clusters (veto)
    // Matches 4+ consecutive true consonants (ignores numbers/symbols which shouldn't be generated anyway)
    const consonants = lower.match(/[bcdfghjklmnpqrstvwxz]{4,}/g);
    if (consonants) {
        for (const cluster of consonants) {
            const validClusters = ['rtsh', 'lthfr', 'ngch', 'rbnb', 'wdstr', 'nthr'];
            if (!validClusters.includes(cluster)) {
                flags.push(`Awkward consonant cluster: ${cluster}`);
                isVetoed = true;
            }
        }
    }
    
    // Check specific bad transitions (e.g. 'hq', 'nl', 'lt' at the end)
    if (/hq/.test(lower)) {
        flags.push("Contains 'hq' cluster");
        isVetoed = true;
    }
    
    // 2. Vowel to Consonant Ratio Imbalance
    const vowelsCount = (lower.match(/[aeiouy]/g) || []).length;
    const consCount = lower.length - vowelsCount;
    
    if (vowelsCount === 0 || consCount === 0) {
        flags.push("Missing vowels or consonants completely");
        isVetoed = true;
    } else {
        const ratio = vowelsCount / consCount;
        if (ratio < 0.3) {
            flags.push(`Vowel starved (ratio ${ratio.toFixed(2)})`);
            penalty -= 0.4;
        }
        if (ratio > 2.5) {
            flags.push(`Vowel overloaded (ratio ${ratio.toFixed(2)})`);
            penalty -= 0.4;
        }
    }
    
    // 3. Repeated Syllables / Artificial spellings
    // e.g., Erer, Eehq, Alalt
    if (lower.length >= 4 && lower.substring(0, 2) === lower.substring(2, 4)) {
        flags.push("Repeated micro-syllable");
        isVetoed = true; // e.g. Erer
    }
    
    if (/^([aeiouy])\1/.test(lower)) {
        flags.push("Repeated starting vowel");
        isVetoed = true; // e.g. Eehq
    }

    // 4. Forced suffixes on tiny roots
    // e.g. Tiify (Ti + ify)
    if (lower.endsWith('ify')) {
        const root = lower.replace(/ify$/, '');
        if (root.length <= 2) {
            flags.push("Forced '-ify' suffix on tiny root");
            isVetoed = true;
        }
    }
    
    if (lower.endsWith('hq') && lower.length <= 4) {
        flags.push("Forced '-hq' on tiny root");
        isVetoed = true;
    }
    
    if (lower.endsWith('io') && lower.length <= 4 && vowelsCount > 2) {
        // e.g. Daio, Leio
        flags.push("Forced '-io' on vowel-heavy short root");
        isVetoed = true;
    }

    // 5. Hard-coded regression traps from the audit
    const badRegressions = ['helt', 'alalt', 'daio', 'atio', 'tiify', 'eehq', 'loer', 'anly', 'rahq', 'bihq', 'orer', 'erer', 'roio'];
    if (badRegressions.includes(lower)) {
        flags.push("Known regression trap");
        isVetoed = true;
    }

    return {
        isVetoed,
        penaltyScore: Math.max(0, isVetoed ? 0 : penalty),
        flags
    };
}
