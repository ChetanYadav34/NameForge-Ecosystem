export enum NormalizationType {
    STRICT,    // Preserves meaningful spelling (e.g. Shopifyy -> shopifyy)
    CANONICAL, // For equivalence (e.g. "Shopify, Inc." -> shopify)
    FUZZY      // For similarity (e.g. "Shopifyy" -> shopify)
}

const LEGAL_SUFFIXES = ['inc', 'llc', 'ltd', 'corp', 'co', 'incorporated', 'corporation', 'limited', 'company'];

export function normalizeName(name: string, type: NormalizationType): string {
    let n = name.toLowerCase();

    // STRICT: just lowercase and trim
    if (type === NormalizationType.STRICT) {
        return n.trim();
    }

    // CANONICAL: remove punctuation, whitespace, and legal suffixes
    // 1. Remove punctuation
    n = n.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"\[\]]/g, '');
    
    // 2. Tokenize by space to remove legal suffixes from the end
    const tokens = n.split(/\s+/).filter(t => t.length > 0);
    
    // Strip trailing legal suffixes if there is more than 1 token
    while (tokens.length > 1) {
        const last = tokens[tokens.length - 1];
        if (LEGAL_SUFFIXES.includes(last)) {
            tokens.pop();
        } else {
            break;
        }
    }
    
    n = tokens.join(''); // no whitespace in canonical representation

    if (type === NormalizationType.CANONICAL) {
        return n;
    }

    // FUZZY: Canonical + remove repeated characters (e.g., shopifyy -> shopify)
    // Only collapse repetitions of the same letter (like 'aa' -> 'a', 'ff' -> 'f')
    if (type === NormalizationType.FUZZY) {
        // We compress repeated characters, but English uses some doubles naturally (e.g., 'll' in 'call').
        // Since it's for fuzzy matching, compressing all doubles is usually fine.
        n = n.replace(/(.)\1+/g, '$1');
        return n;
    }

    return n;
}

// Phonetic key generator (very basic Soundex implementation for illustration and fast DB matching)
export function generatePhoneticKey(name: string): string {
    const s = normalizeName(name, NormalizationType.CANONICAL).toUpperCase();
    if (!s) return "";

    const map: Record<string, string> = {
        'B': '1', 'F': '1', 'P': '1', 'V': '1',
        'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
        'D': '3', 'T': '3',
        'L': '4',
        'M': '5', 'N': '5',
        'R': '6'
    };

    let res = s.charAt(0);
    let prevCode = map[s.charAt(0)] || '';

    for (let i = 1; i < s.length; i++) {
        const code = map[s.charAt(i)] || '';
        if (code !== '' && code !== prevCode) {
            res += code;
        }
        prevCode = code;
    }

    // Pad with zeros to length 4, or truncate to length 4
    return (res + "0000").substring(0, 4);
}
