// ============================================================================
// LexForge Dataset Compiler — Golden Test
// ============================================================================
// Regression test with representative words to verify ARPABET→IPA
// transformation correctness across compiler updates.
//
// Run: npm test
//
// These expected values are hand-verified against standard linguistic
// references. If a test fails after a change, the transformation
// logic has regressed and must be investigated.
// ============================================================================

// ============================================================================
// LexForge Dataset Compiler — Golden Test
// ============================================================================
// Regression test with representative words to verify ARPABET→IPA
// and IPA→Phonology transformations across compiler updates.
//
// Run: npm test
// ============================================================================

import { ArpabetToIpaTransformer } from "../src/transformers/arpabet-to-ipa.transformer.js";
import { IpaToPhonologyTransformer } from "../src/transformers/ipa-to-phonology.transformer.js";
import { MergedWord } from "../src/types/index.js";

// ─── Test Data ───────────────────────────────────────────────────────────────

interface GoldenEntry {
  word: string;
  arpabet: string;
  expectedIpa: string;
  expectedPhonemes: string[];
  expectedVowels: string[];
  expectedConsonants: string[];
  expectedStress: string;
  description: string;
}

const GOLDEN_ENTRIES: GoldenEntry[] = [
  {
    word: "algorithm",
    arpabet: "AE1 L G ER0 IH2 DH AH0 M",
    expectedIpa: "ˈælɡɚˌɪðəm",
    expectedPhonemes: ["æ", "l", "ɡ", "ɚ", "ɪ", "ð", "ə", "m"],
    expectedVowels: ["æ", "ɚ", "ɪ", "ə"],
    expectedConsonants: ["l", "ɡ", "ð", "m"],
    expectedStress: "1020",
    description: "Tests primary stress, secondary stress, unstressed AH→ə, unstressed ER→ɚ",
  },
  {
    word: "route",
    arpabet: "R UW1 T",
    expectedIpa: "ɹˈut",
    expectedPhonemes: ["ɹ", "u", "t"],
    expectedVowels: ["u"],
    expectedConsonants: ["ɹ", "t"],
    expectedStress: "1",
    description: "Tests consonant R→ɹ, stressed vowel UW1, simple structure",
  },
  {
    word: "computer",
    arpabet: "K AH0 M P Y UW1 T ER0",
    expectedIpa: "kəmpjˈutɚ",
    expectedPhonemes: ["k", "ə", "m", "p", "j", "u", "t", "ɚ"],
    expectedVowels: ["ə", "u", "ɚ"],
    expectedConsonants: ["k", "m", "p", "j", "t"],
    expectedStress: "010",
    description: "Tests unstressed AH→ə, consonant Y→j, unstressed ER→ɚ",
  },
  {
    word: "psychology",
    arpabet: "S AY0 K AA1 L AH0 JH IY0",
    expectedIpa: "saɪkˈɑlədʒi",
    expectedPhonemes: ["s", "aɪ", "k", "ɑ", "l", "ə", "dʒ", "i"],
    expectedVowels: ["aɪ", "ɑ", "ə", "i"],
    expectedConsonants: ["s", "k", "l", "dʒ"],
    expectedStress: "0100",
    description: "Tests silent P (not in ARPABET), AY diphthong, JH→dʒ",
  },
  {
    word: "butter",
    arpabet: "B AH1 T ER0",
    expectedIpa: "bˈʌtɚ",
    expectedPhonemes: ["b", "ʌ", "t", "ɚ"],
    expectedVowels: ["ʌ", "ɚ"],
    expectedConsonants: ["b", "t"],
    expectedStress: "10",
    description: "Tests stressed AH→ˈʌ (not schwa), unstressed ER→ɚ",
  },
  {
    word: "church",
    arpabet: "CH ER1 CH",
    expectedIpa: "tʃˈɝtʃ",
    expectedPhonemes: ["tʃ", "ɝ", "tʃ"],
    expectedVowels: ["ɝ"],
    expectedConsonants: ["tʃ", "tʃ"],
    expectedStress: "1",
    description: "Tests CH→tʃ (affricate), stressed ER→ɝ",
  },
  {
    word: "measure",
    arpabet: "M EH1 ZH ER0",
    expectedIpa: "mˈɛʒɚ",
    expectedPhonemes: ["m", "ɛ", "ʒ", "ɚ"],
    expectedVowels: ["ɛ", "ɚ"],
    expectedConsonants: ["m", "ʒ"],
    expectedStress: "10",
    description: "Tests ZH→ʒ, unstressed ER→ɚ",
  },
  {
    word: "thought",
    arpabet: "TH AO1 T",
    expectedIpa: "θˈɔt",
    expectedPhonemes: ["θ", "ɔ", "t"],
    expectedVowels: ["ɔ"],
    expectedConsonants: ["θ", "t"],
    expectedStress: "1",
    description: "Tests TH→θ (voiceless), stressed AO",
  },
  {
    word: "strength",
    arpabet: "S T R EH1 NG K TH",
    expectedIpa: "stɹˈɛŋkθ",
    expectedPhonemes: ["s", "t", "ɹ", "ɛ", "ŋ", "k", "θ"],
    expectedVowels: ["ɛ"],
    expectedConsonants: ["s", "t", "ɹ", "ŋ", "k", "θ"],
    expectedStress: "1",
    description: "Tests complex consonant clusters",
  },
  {
    word: "queue",
    arpabet: "K Y UW1",
    expectedIpa: "kjˈu",
    expectedPhonemes: ["k", "j", "u"],
    expectedVowels: ["u"],
    expectedConsonants: ["k", "j"],
    expectedStress: "1",
    description: "Tests silent letters and glide Y→j",
  },
  {
    word: "rhythm",
    arpabet: "R IH1 DH AH0 M",
    expectedIpa: "ɹˈɪðəm",
    expectedPhonemes: ["ɹ", "ɪ", "ð", "ə", "m"],
    expectedVowels: ["ɪ", "ə"],
    expectedConsonants: ["ɹ", "ð", "m"],
    expectedStress: "10",
    description: "Tests vocalic consonants often analyzed with schwas",
  },
  {
    word: "xylophone",
    arpabet: "Z AY1 L AH0 F OW2 N",
    expectedIpa: "zˈaɪləfˌoʊn",
    expectedPhonemes: ["z", "aɪ", "l", "ə", "f", "oʊ", "n"],
    expectedVowels: ["aɪ", "ə", "oʊ"],
    expectedConsonants: ["z", "l", "f", "n"],
    expectedStress: "102",
    description: "Tests X→Z, diphthongs, and secondary stress",
  }
];

// ─── Test Runner ─────────────────────────────────────────────────────────────

function runGoldenTests(): void {
  const ipaTransformer = new ArpabetToIpaTransformer();
  const phonologyTransformer = new IpaToPhonologyTransformer();

  console.log("");
  console.log("═══════════════════════════════════════════════════");
  console.log("  LexForge Golden Test — v3 Phonology Regression");
  console.log("═══════════════════════════════════════════════════");
  console.log("");

  const mergedWords: MergedWord[] = GOLDEN_ENTRIES.map((e) => ({
    word: e.word,
    arpabet: e.arpabet,
    alternatePronunciations: [],
  }));

  const ipaResult = ipaTransformer.transform(mergedWords);
  const result = phonologyTransformer.transform(ipaResult.records);

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < GOLDEN_ENTRIES.length; i++) {
    const golden = GOLDEN_ENTRIES[i];
    const actual = result.records[i];

    const errors: string[] = [];

    if (actual.ipa !== golden.expectedIpa) {
      errors.push(`IPA: expected ${golden.expectedIpa}, got ${actual.ipa}`);
    }
    if (actual.stressPattern !== golden.expectedStress) {
      errors.push(`Stress: expected ${golden.expectedStress}, got ${actual.stressPattern}`);
    }
    if (JSON.stringify(actual.phonemes) !== JSON.stringify(golden.expectedPhonemes)) {
      errors.push(`Phonemes: expected ${JSON.stringify(golden.expectedPhonemes)}, got ${JSON.stringify(actual.phonemes)}`);
    }
    if (JSON.stringify(actual.vowels) !== JSON.stringify(golden.expectedVowels)) {
      errors.push(`Vowels: expected ${JSON.stringify(golden.expectedVowels)}, got ${JSON.stringify(actual.vowels)}`);
    }
    if (JSON.stringify(actual.consonants) !== JSON.stringify(golden.expectedConsonants)) {
      errors.push(`Consonants: expected ${JSON.stringify(golden.expectedConsonants)}, got ${JSON.stringify(actual.consonants)}`);
    }

    if (errors.length === 0) {
      passed++;
      console.log(`  ✓ ${golden.word.padEnd(14)} ${actual.ipa} -> [${actual.phonemes.join(",")}]`);
    } else {
      failed++;
      console.log(`  ✗ ${golden.word.padEnd(14)} FAILED`);
      for (const err of errors) {
        console.log(`      ${err}`);
      }
    }
  }

  console.log("");
  console.log("───────────────────────────────────────────────────");
  console.log(`  Results: ${passed} passed, ${failed} failed, ${GOLDEN_ENTRIES.length} total`);
  console.log("───────────────────────────────────────────────────");
  console.log("");

  if (failed > 0) {
    process.exit(1);
  }
}

runGoldenTests();
