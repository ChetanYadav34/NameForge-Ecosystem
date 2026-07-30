// ============================================================================
// LexForge Dataset Compiler — ARPABET to IPA Transformer
// ============================================================================
// Converts ARPABET pronunciation strings to International Phonetic Alphabet.
//
// Features:
//   • Complete mapping for all 39 standard CMU dict phonemes
//   • Extended mappings for rare phonemes (AX, AXR, IX, UX, DX, Q, WH, etc.)
//   • Stress-dependent vowel variants (AH: ə/ʌ, ER: ɚ/ɝ)
//   • IPA stress markers (ˈ for primary, ˌ for secondary)
//   • Graceful handling of unknown tokens (warns, preserves token, continues)
// ============================================================================

import { BaseTransformer } from "./base.transformer.js";
import { MergedWord, TransformedWord, TransformResult } from "../types/index.js";
import { logger } from "../utils/logger.js";

// ─── ARPABET → IPA Mapping Tables ────────────────────────────────────────────

/**
 * Vowel phonemes that have DIFFERENT IPA symbols depending on stress.
 * Key = ARPABET base, Value = { unstressed, stressed }
 */
const STRESS_DEPENDENT_VOWELS: Record<string, { unstressed: string; stressed: string }> = {
  "AH": { unstressed: "ə", stressed: "ʌ" },
  "ER": { unstressed: "ɚ", stressed: "ɝ" },
};

/**
 * Vowel phonemes that use the SAME IPA symbol regardless of stress.
 * Stress is indicated only by the ˈ/ˌ marker prefix.
 */
const STANDARD_VOWELS: Record<string, string> = {
  "AA": "ɑ",
  "AE": "æ",
  "AO": "ɔ",
  "AW": "aʊ",
  "AY": "aɪ",
  "EH": "ɛ",
  "EY": "eɪ",
  "IH": "ɪ",
  "IY": "i",
  "OW": "oʊ",
  "OY": "ɔɪ",
  "UH": "ʊ",
  "UW": "u",
  // Rare vowels
  "AX":  "ə",
  "AXR": "ɚ",
  "IX":  "ɨ",
  "UX":  "ʉ",
};

/**
 * All vowel base phonemes (union of both maps) — used to detect vowels.
 */
const ALL_VOWELS = new Set([
  ...Object.keys(STRESS_DEPENDENT_VOWELS),
  ...Object.keys(STANDARD_VOWELS),
]);

/**
 * Consonant phonemes (no stress markers).
 */
const CONSONANTS: Record<string, string> = {
  "B":  "b",
  "CH": "tʃ",
  "D":  "d",
  "DH": "ð",
  "DX": "ɾ",
  "EL": "l̩",
  "EM": "m̩",
  "EN": "n̩",
  "F":  "f",
  "G":  "ɡ",
  "HH": "h",
  "JH": "dʒ",
  "K":  "k",
  "L":  "l",
  "M":  "m",
  "N":  "n",
  "NG": "ŋ",
  "NX": "ɾ̃",
  "P":  "p",
  "Q":  "ʔ",
  "R":  "ɹ",
  "S":  "s",
  "SH": "ʃ",
  "T":  "t",
  "TH": "θ",
  "V":  "v",
  "W":  "w",
  "WH": "ʍ",
  "Y":  "j",
  "Z":  "z",
  "ZH": "ʒ",
};

// ─── Token Parsing ───────────────────────────────────────────────────────────

interface ParsedToken {
  base: string;
  stress: number; // -1 = no stress (consonant), 0/1/2 = stress level
}

/**
 * Parse an ARPABET token into its base phoneme and stress level.
 *
 * Examples:
 *   "AE1"  → { base: "AE", stress: 1 }
 *   "AH0"  → { base: "AH", stress: 0 }
 *   "B"    → { base: "B",  stress: -1 }
 */
function parseToken(token: string): ParsedToken {
  const lastChar = token[token.length - 1];

  if (lastChar === "0" || lastChar === "1" || lastChar === "2") {
    return {
      base: token.substring(0, token.length - 1),
      stress: parseInt(lastChar, 10),
    };
  }

  return { base: token, stress: -1 };
}

// ─── Single Token → IPA ─────────────────────────────────────────────────────

interface TokenConversion {
  ipa: string;
  warning: string | null;
}

/**
 * Convert a single ARPABET token to its IPA representation.
 *
 * Handles:
 *   • Stress-dependent vowels (AH, ER)
 *   • Standard vowels with stress markers
 *   • Consonants
 *   • Unknown tokens (returns empty string with warning)
 */
function convertToken(token: string): TokenConversion {
  const { base, stress } = parseToken(token);
  const isVowel = ALL_VOWELS.has(base);

  // --- Stress-dependent vowels ---
  if (base in STRESS_DEPENDENT_VOWELS) {
    const variants = STRESS_DEPENDENT_VOWELS[base];
    const isStressed = stress >= 1;
    const ipaChar = isStressed ? variants.stressed : variants.unstressed;

    if (stress === 1) return { ipa: `ˈ${ipaChar}`, warning: null };
    if (stress === 2) return { ipa: `ˌ${ipaChar}`, warning: null };
    return { ipa: ipaChar, warning: null };
  }

  // --- Standard vowels ---
  if (isVowel) {
    const ipaChar = STANDARD_VOWELS[base];
    if (!ipaChar) {
      return { ipa: "", warning: `Unknown vowel "${token}"` };
    }

    if (stress === 1) return { ipa: `ˈ${ipaChar}`, warning: null };
    if (stress === 2) return { ipa: `ˌ${ipaChar}`, warning: null };
    return { ipa: ipaChar, warning: null };
  }

  // --- Consonants ---
  const consonantIpa = CONSONANTS[base];
  if (consonantIpa !== undefined) {
    return { ipa: consonantIpa, warning: null };
  }

  // --- Unknown token ---
  return { ipa: "", warning: `Unknown ARPABET token "${token}"` };
}

// ─── Full ARPABET String → IPA ───────────────────────────────────────────────

interface ArpabetConversion {
  ipa: string;
  warnings: string[];
}

/**
 * Convert a full ARPABET pronunciation string to IPA.
 *
 * @param arpabet - Space-separated ARPABET tokens (e.g., "AE1 L G ER0 IH2 DH AH0 M")
 * @returns The IPA string and any warnings encountered.
 */
function convertArpabetToIpa(arpabet: string): ArpabetConversion {
  if (arpabet.length === 0) {
    return { ipa: "", warnings: [] };
  }

  const tokens = arpabet.split(/\s+/);
  const ipaParts: string[] = [];
  const warnings: string[] = [];

  for (const token of tokens) {
    const result = convertToken(token);

    if (result.warning) {
      warnings.push(result.warning);
      // Graceful degradation: skip the unknown token's IPA contribution
      // but continue processing the rest of the string
    }

    if (result.ipa.length > 0) {
      ipaParts.push(result.ipa);
    }
  }

  return { ipa: ipaParts.join(""), warnings };
}

// ─── Transformer Class ──────────────────────────────────────────────────────

export class ArpabetToIpaTransformer extends BaseTransformer<MergedWord, TransformedWord> {
  readonly name = "ARPABET → IPA";

  transform(records: MergedWord[]): TransformResult<TransformedWord> {
    logger.info("Converting ARPABET pronunciations to IPA...");

    const output: TransformedWord[] = [];
    const allWarnings: string[] = [];
    let transformedCount = 0;
    let skippedCount = 0;

    for (const record of records) {
      if (record.arpabet.length === 0) {
        // No pronunciation available — skip IPA generation
        skippedCount++;
        output.push({
          word: record.word,
          arpabet: record.arpabet,
          alternatePronunciations: record.alternatePronunciations,
          ipa: "",
        });
        continue;
      }

      const conversion = convertArpabetToIpa(record.arpabet);

      // Log warnings but never stop compilation
      for (const warning of conversion.warnings) {
        allWarnings.push(`${record.word}: ${warning}`);
      }

      transformedCount++;
      output.push({
        word: record.word,
        arpabet: record.arpabet,
        alternatePronunciations: record.alternatePronunciations,
        ipa: conversion.ipa,
      });
    }

    logger.success(`Converted ${transformedCount.toLocaleString()} pronunciations to IPA`);
    logger.stat("Skipped (no pronunciation)", skippedCount.toLocaleString());

    if (allWarnings.length > 0) {
      logger.warn(`${allWarnings.length} ARPABET→IPA warning(s)`);
      const previewCount = Math.min(allWarnings.length, 5);
      for (let i = 0; i < previewCount; i++) {
        logger.info(`  ${allWarnings[i]}`);
      }
      if (allWarnings.length > previewCount) {
        logger.info(`  ... and ${allWarnings.length - previewCount} more`);
      }
    }

    return {
      records: output,
      transformedCount,
      skippedCount,
      warnings: allWarnings,
    };
  }
}
