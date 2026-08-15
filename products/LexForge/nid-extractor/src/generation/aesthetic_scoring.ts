/**
 * Aesthetic Scoring Layer
 * Grades candidates on Memorability, Premium Feel, Founder Appeal,
 * Investor Appeal, Brand Confidence, Visual Cleanliness, and Naming Modernity.
 */

export interface AestheticScores {
    memorability: number;
    premiumFeel: number;
    founderAppeal: number;
    investorAppeal: number;
    visualCleanliness: number;
    brandConfidence: number;
    namingModernity: number;
    aestheticTotal: number; // 0 to 100
}

export function scoreAesthetics(name: string): AestheticScores {
    const lower = name.toLowerCase();
    const len = name.length;
    
    let memorability = 60;
    let premiumFeel = 60;
    let founderAppeal = 60;
    let investorAppeal = 60;
    let visualCleanliness = 60;
    let brandConfidence = 60;
    let namingModernity = 0; // Capped at 5% of total later
    
    // 1. Length impact (4-8 chars is optimal)
    if (len >= 5 && len <= 8) {
        premiumFeel += 30;
        memorability += 20;
        founderAppeal += 30;
        investorAppeal += 20;
    } else if (len === 4) {
        premiumFeel += 40;
        memorability += 30;
        founderAppeal += 30;
        investorAppeal += 30;
    } else if (len < 4) {
        // Too short, heavily saturated, causes exact conflicts
        premiumFeel -= 30;
        founderAppeal -= 30;
        visualCleanliness -= 10;
    } else if (len >= 9 && len <= 10) {
        // Acceptable but slightly long
        founderAppeal -= 10;
        memorability -= 10;
    } else if (len > 10) {
        memorability -= 30;
        premiumFeel -= 20;
        visualCleanliness -= 20;
    }

    // 2. Vowel / Consonant Balance
    const vowelsCount = (lower.match(/[aeiouy]/g) || []).length;
    const consCount = len - vowelsCount;
    const ratio = consCount > 0 ? vowelsCount / consCount : 0;
    
    if (ratio >= 0.3 && ratio <= 2.0) { // Broadened to 0.3 to include Ramp (0.33)
        visualCleanliness += 30;
        premiumFeel += 20;
    } else {
        visualCleanliness -= 20;
        premiumFeel -= 10;
    }

    // 3. Ending Strength
    if (/[rnpxadlec]$/.test(lower)) {
        // Strong endings: r (Linear), n (Notion), x (Brex), p (Ramp), a (Figma), d (Plaid), l (Vercel), e (Stripe), c (Anthropic)
        brandConfidence += 25;
        investorAppeal += 25;
        premiumFeel += 15;
    }
    
    if (/(ify|hq|ly)$/.test(lower)) {
        // Modernity flags
        namingModernity += 100; // Will be capped
        founderAppeal += 10;
        premiumFeel -= 10; 
        brandConfidence -= 10; 
    } else if (/(io|ai)$/.test(lower)) {
        namingModernity += 100;
        founderAppeal += 30;
        premiumFeel += 10;
    }

    // 4. Syllable count proxy (CVCV transitions)
    const transitions = (lower.match(/[aeiouy]+[^aeiouy]+/g) || []).length;
    if (transitions >= 1 && transitions <= 3) {
        // 1 to 3 syllables (Stripe, Notion, Datadog)
        memorability += 30;
        brandConfidence += 20;
        premiumFeel += 10;
    } else if (transitions > 3) {
        memorability -= 20;
        investorAppeal -= 10;
    }

    // Normalizing scores 0-100
    const norm = (val: number) => Math.max(0, Math.min(100, val));
    memorability = norm(memorability);
    premiumFeel = norm(premiumFeel);
    founderAppeal = norm(founderAppeal);
    investorAppeal = norm(investorAppeal);
    visualCleanliness = norm(visualCleanliness);
    brandConfidence = norm(brandConfidence);
    namingModernity = norm(namingModernity);

    // Naming Modernity max contribution is 5%
    // The other 6 attributes make up 95% (each 15.83%)
    const baseTotal = (memorability + premiumFeel + founderAppeal + investorAppeal + visualCleanliness + brandConfidence) / 6;
    
    const aestheticTotal = (baseTotal * 0.95) + (namingModernity * 0.05);

    return {
        memorability,
        premiumFeel,
        founderAppeal,
        investorAppeal,
        visualCleanliness,
        brandConfidence,
        namingModernity,
        aestheticTotal: norm(aestheticTotal)
    };
}
