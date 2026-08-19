export type Database = any;
import { Candidate } from './types';
import { ValidationResult } from './candidate_validator';
import { PhonotacticResult } from './phonotactic_engine';

export interface MutationResult {
    success: boolean;
    mutatedString: string;
    mutationHistory: string[];
    mutationQualityScore: number;
    semanticPreservationScore: number;
    noveltyScore: number;
}

// Simple Levenshtein distance
function getEditDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Compute string overlap to verify semantic preservation (root hasn't been destroyed)
function computeSemanticPreservation(original: string, mutated: string): number {
    const o = original.toLowerCase();
    const m = mutated.toLowerCase();
    
    // Very simple longest common substring or prefix/suffix match
    // Real semantic preservation relies on meaning, but here we just ensure the root string is still mostly intact
    if (m === o) return 1.0;
    
    let commonChars = 0;
    for (let i=0; i<Math.min(o.length, m.length); i++) {
        if (o[i] === m[i]) commonChars++;
    }
    
    return commonChars / Math.max(o.length, m.length);
}

export class MutationEngine {
    private db: Database;
    private topSuffixes: string[] = [];

    constructor(db: Database) {
        this.db = db;
    }

    public async init() {
        const rows = (await this.db.prepare(`SELECT affix FROM affix_statistics WHERE type = 'suffix' ORDER BY global_frequency DESC LIMIT 20`).all()).results as any[];
        this.topSuffixes = rows.map(r => r.affix);
    }

    public static async create(db: Database): Promise<MutationEngine> {
        const engine = new MutationEngine(db);
        await engine.init();
        return engine;
    }

    public async mutateCandidate(candidateStr: string, originalMorphemesStr: string): Promise<MutationResult> {
        let currentStr = candidateStr.toLowerCase();
        const history: string[] = [];
        let mutationQuality = 0.5; // Neutral starting point

        // 1. Boundary Smoothing (Morpheme overlap e.g., health + tech -> healtech)
        // Look for double consonants that can be merged, or a vowel next to a vowel
        const doubleMatch = currentStr.match(/([a-z])\1/);
        if (doubleMatch && Math.random() > 0.3) {
            currentStr = currentStr.replace(/([a-z])\1/, '$1');
            history.push(`BoundarySmoothing:MergedDouble${doubleMatch[1]}`);
            mutationQuality += 0.1;
        }

        // 2. Vowel Deletion (e.g. dropping 'e' before 'r' like Flickr)
        if (currentStr.endsWith('er') && Math.random() > 0.5 && currentStr.length > 5) {
            currentStr = currentStr.slice(0, -2) + 'r';
            history.push('VowelDeletion:DroppedEBeforeR');
            mutationQuality += 0.2;
        }

        // 3. Consonant Substitution (e.g., 'c' to 'k', 'i' to 'y')
        if (currentStr.includes('c') && Math.random() > 0.7) {
            currentStr = currentStr.replace('c', 'k');
            history.push('ConsonantSubstitution:CtoK');
            mutationQuality += 0.1;
        } else if (currentStr.includes('i') && Math.random() > 0.8 && currentStr.length > 4) {
            currentStr = currentStr.replace('i', 'y');
            history.push('ConsonantSubstitution:ItoY');
            mutationQuality += 0.1;
        }

        // 4. Suffix Harmonization
        // Only if it doesn't already have a recognized suffix and it's short
        if (currentStr.length <= 6 && Math.random() > 0.7 && this.topSuffixes.length > 0) {
            // Pick a random top suffix that fits
            const suffix = this.topSuffixes[Math.floor(Math.random() * Math.min(5, this.topSuffixes.length))]; // Pick from top 5
            if (!currentStr.endsWith(suffix) && !['ify', 'io', 'ly', 'er'].includes(suffix)) { // User rule: don't just append these blindly
                currentStr += suffix;
                history.push(`SuffixHarmonization:Added${suffix}`);
                mutationQuality += 0.15;
            }
        }

        // Capitalize properly
        currentStr = currentStr.charAt(0).toUpperCase() + currentStr.slice(1);

        // Calculate preservation
        const preservationScore = computeSemanticPreservation(originalMorphemesStr, currentStr);

        // Check Novelty
        const noveltyScore = await this.checkNovelty(currentStr);

        return {
            success: history.length > 0 && preservationScore > 0.5 && noveltyScore > 0.3,
            mutatedString: currentStr,
            mutationHistory: history,
            mutationQualityScore: Math.min(1.0, mutationQuality),
            semanticPreservationScore: preservationScore,
            noveltyScore
        };
    }

    private async checkNovelty(candidate: string): Promise<number> {
        const lower = candidate.toLowerCase();
        
        // 1. Check exact match in benchmark
        const benchMatch = await this.db.prepare(`SELECT 1 FROM benchmark_companies WHERE LOWER(company_name) = ?`).bind(lower).first();
        if (benchMatch) return 0.0; // Fail novelty

        // 2. Check Levenshtein against benchmarks
        const benchmarks = (await this.db.prepare(`SELECT company_name FROM benchmark_companies`).all()).results as any[];
        for (const b of benchmarks) {
            const dist = getEditDistance(lower, b.company_name.toLowerCase());
            if (dist <= 2 && lower.length >= 5) { // e.g. Strype vs Stripe
                return 0.1; // Severe penalty
            }
        }

        // 3. Fast exact match check against corpus (if table exists and is accessible)
        try {
            const exactMatch = await this.db.prepare(`SELECT 1 FROM company_raw_data WHERE LOWER(name) = ? LIMIT 1`).bind(lower).first();
            if (exactMatch) return 0.2;
        } catch (e) {
            // Ignore if table not present in test db
        }

        return 0.9; // Good novelty
    }
}
