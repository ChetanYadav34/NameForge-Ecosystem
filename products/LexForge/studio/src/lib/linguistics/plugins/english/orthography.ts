import { Phoneme } from "../../models/types";

/**
 * Maps an array of Phonemes (IPA) to standard English Orthography.
 * Handles common digraphs and positional rules.
 */
export function mapEnglishOrthography(phonemes: Phoneme[]): string {
  let result = "";
  
  for (let i = 0; i < phonemes.length; i++) {
    const p = phonemes[i];
    const next = phonemes[i + 1];
    const prev = phonemes[i - 1];

    // Consonants
    if (p.ipa === "k") {
      // Very basic orthographic contextual rule: c before a/o/u, k before e/i
      if (next && (next.ipa === "e" || next.ipa === "i" || next.ipa === "ɪ" || next.ipa === "ɛ")) {
        result += "k";
      } else {
        result += "c";
      }
    }
    else if (p.ipa === "j") result += "y";
    else if (p.ipa === "tʃ") result += "ch";
    else if (p.ipa === "dʒ") result += "j"; // or 'g' if before e/i
    else if (p.ipa === "ʃ") result += "sh";
    else if (p.ipa === "ʒ") result += "zh";
    else if (p.ipa === "θ" || p.ipa === "ð") result += "th";
    else if (p.ipa === "ŋ") result += "ng";
    
    // Vowels (simplified approximations for deterministic generation)
    else if (p.ipa === "i") result += "ee";
    else if (p.ipa === "ɪ") result += "i";
    else if (p.ipa === "ɛ") result += "e";
    else if (p.ipa === "æ") result += "a";
    else if (p.ipa === "ʌ" || p.ipa === "ə") result += "u";
    else if (p.ipa === "ɜr") result += "er";
    else if (p.ipa === "u") result += "oo";
    else if (p.ipa === "ʊ") result += "u";
    else if (p.ipa === "ɔ") result += "aw";
    else if (p.ipa === "ɑ") result += "o";
    else if (p.ipa === "eɪ") result += "ay";
    else if (p.ipa === "aɪ") result += "y";
    else if (p.ipa === "ɔɪ") result += "oy";
    else if (p.ipa === "aʊ") result += "ow";
    else if (p.ipa === "oʊ") result += "o";
    else {
      // Fallback
      result += p.ipa;
    }
  }

  // Handle silent 'e' if word ends in VCV (naive heuristic)
  if (phonemes.length >= 3) {
    const last = phonemes[phonemes.length - 1];
    const secondLast = phonemes[phonemes.length - 2];
    const thirdLast = phonemes[phonemes.length - 3];
    
    if (last.manner !== "vowel" && secondLast.manner === "vowel" && thirdLast.manner !== "vowel") {
      // E.g. "ay" mapping above, or a long vowel might necessitate silent e
      if (secondLast.ipa === "aɪ" || secondLast.ipa === "eɪ" || secondLast.ipa === "oʊ") {
        result += "e"; 
        // e.g. /faɪn/ -> f y n e -> fyne (rough mapping, but deterministic)
      }
    }
  }

  return result;
}
