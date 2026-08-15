import { validateCandidate } from '../generation/candidate_validator';
import { analyzePhonotactics } from '../generation/phonotactic_engine';
import { scoreBrandability } from '../generation/brandability_score';

describe('Phase 4.2A: Phonotactic & Validation Engine', () => {
    
    test('validateCandidate rejects short names and fragments', () => {
        expect(validateCandidate('test-req', 'abc').isValid).toBe(false);
        expect(validateCandidate('test-req', 'healt').isValid).toBe(false); // dictionary fragment
    });

    test('validateCandidate allows valid names and applies soft consonant penalties', () => {
        const result = validateCandidate('test-req', 'fintechify');
        expect(result.isValid).toBe(true);
        expect(result.failures.length).toBe(0);
        
        // "cht" is a triple consonant, should apply soft penalty
        const hardResult = validateCandidate('test-req', 'bankstrap'); 
        // "nks" and "str" are triple consonant clusters. If it doesn't contain hard letters, it's just a penalty
        expect(hardResult.isValid).toBe(true);
        expect(hardResult.validationScore).toBeLessThan(1.0);
    });

    test('analyzePhonotactics calculates shape and syllables correctly', () => {
        const phono = analyzePhonotactics('test-req', 'stripe');
        expect(phono.phoneticShape).toBe('CCCVCV');
        // i and e -> 2 vowel groups. e is at the end, so subtract 1 -> 1 syllable
        expect(phono.syllableCount).toBe(1);
    });

    test('analyzePhonotactics penalizes impossible clusters', () => {
        const phono = analyzePhonotactics('test-req', 'prtmn');
        expect(phono.phoneticShape).toBe('CCCCC');
        expect(phono.issues).toContain('LONG_CONSONANT_CLUSTER');
        expect(phono.pronounceabilityScore).toBeLessThan(1.0);
    });

    test('scoreBrandability computes composite correctly', () => {
        const val = validateCandidate('test-req', 'apple');
        const phono = analyzePhonotactics('test-req', 'apple');
        const brand = scoreBrandability('test-req', 'apple', val, phono);
        
        expect(brand.brandabilityScore).toBeGreaterThan(0);
        expect(brand.brandabilityScore).toBeLessThanOrEqual(100);
        
        // "apple" length is 5 (ideal, fitness 1.0)
        expect(brand.components.lengthFitness).toBe(1.0);
    });
});
