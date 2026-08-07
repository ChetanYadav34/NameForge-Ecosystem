import { Phoneme, LinguisticMetadata, PhonosemanticVector } from "../../models/types";

// Base metadata factory for standard English phonemes
const createMetadata = (freq: number, prod: number): LinguisticMetadata => ({
  frequency: freq,
  rarity: 1 - freq,
  productivity: prod,
  confidence: 1.0,
  source: "English Phoneme Inventory (CMU/IPA)",
  version: "1.0.0"
});

// Base phonosemantic vectors based on Lexicon/Catchword sound symbolism
const PLOSIVE_UNVOICED: PhonosemanticVector = { energy: 0.8, warmth: 0.2, luxury: 0.4, precision: 0.9, aggression: 0.7, playfulness: 0.3, elegance: 0.5, trust: 0.6, innovation: 0.8 };
const PLOSIVE_VOICED: PhonosemanticVector = { energy: 0.9, warmth: 0.4, luxury: 0.6, precision: 0.8, aggression: 0.8, playfulness: 0.2, elegance: 0.4, trust: 0.8, innovation: 0.6 };
const FRICATIVE_UNVOICED: PhonosemanticVector = { energy: 0.7, warmth: 0.3, luxury: 0.7, precision: 0.7, aggression: 0.6, playfulness: 0.4, elegance: 0.7, trust: 0.5, innovation: 0.7 };
const FRICATIVE_VOICED: PhonosemanticVector = { energy: 0.8, warmth: 0.5, luxury: 0.8, precision: 0.6, aggression: 0.7, playfulness: 0.3, elegance: 0.8, trust: 0.6, innovation: 0.9 };
const NASAL: PhonosemanticVector = { energy: 0.4, warmth: 0.9, luxury: 0.6, precision: 0.4, aggression: 0.1, playfulness: 0.5, elegance: 0.7, trust: 0.9, innovation: 0.4 };
const LIQUID: PhonosemanticVector = { energy: 0.5, warmth: 0.8, luxury: 0.9, precision: 0.3, aggression: 0.2, playfulness: 0.7, elegance: 0.9, trust: 0.7, innovation: 0.5 };
const VOWEL_FRONT: PhonosemanticVector = { energy: 0.8, warmth: 0.4, luxury: 0.7, precision: 0.8, aggression: 0.4, playfulness: 0.7, elegance: 0.7, trust: 0.5, innovation: 0.9 };
const VOWEL_BACK: PhonosemanticVector = { energy: 0.6, warmth: 0.8, luxury: 0.8, precision: 0.4, aggression: 0.5, playfulness: 0.3, elegance: 0.8, trust: 0.8, innovation: 0.4 };
const VOWEL_CENTRAL: PhonosemanticVector = { energy: 0.4, warmth: 0.7, luxury: 0.5, precision: 0.5, aggression: 0.3, playfulness: 0.5, elegance: 0.5, trust: 0.7, innovation: 0.5 };

export const ENGLISH_PHONEMES: Phoneme[] = [
  // Consonants - Plosives
  { id: "p", ipa: "p", manner: "plosive", place: "bilabial", voiced: false, sonority: 1, phonosemantics: PLOSIVE_UNVOICED, metadata: createMetadata(0.08, 0.9) },
  { id: "b", ipa: "b", manner: "plosive", place: "bilabial", voiced: true, sonority: 1, phonosemantics: PLOSIVE_VOICED, metadata: createMetadata(0.07, 0.9) },
  { id: "t", ipa: "t", manner: "plosive", place: "alveolar", voiced: false, sonority: 1, phonosemantics: PLOSIVE_UNVOICED, metadata: createMetadata(0.12, 0.9) },
  { id: "d", ipa: "d", manner: "plosive", place: "alveolar", voiced: true, sonority: 1, phonosemantics: PLOSIVE_VOICED, metadata: createMetadata(0.10, 0.9) },
  { id: "k", ipa: "k", manner: "plosive", place: "velar", voiced: false, sonority: 1, phonosemantics: PLOSIVE_UNVOICED, metadata: createMetadata(0.09, 0.9) },
  { id: "g", ipa: "g", manner: "plosive", place: "velar", voiced: true, sonority: 1, phonosemantics: PLOSIVE_VOICED, metadata: createMetadata(0.05, 0.8) },

  // Consonants - Fricatives
  { id: "f", ipa: "f", manner: "fricative", place: "labiodental", voiced: false, sonority: 2, phonosemantics: FRICATIVE_UNVOICED, metadata: createMetadata(0.06, 0.8) },
  { id: "v", ipa: "v", manner: "fricative", place: "labiodental", voiced: true, sonority: 2, phonosemantics: FRICATIVE_VOICED, metadata: createMetadata(0.05, 0.8) },
  { id: "th", ipa: "θ", manner: "fricative", place: "dental", voiced: false, sonority: 2, phonosemantics: FRICATIVE_UNVOICED, metadata: createMetadata(0.04, 0.5) },
  { id: "dh", ipa: "ð", manner: "fricative", place: "dental", voiced: true, sonority: 2, phonosemantics: FRICATIVE_VOICED, metadata: createMetadata(0.07, 0.3) },
  { id: "s", ipa: "s", manner: "fricative", place: "alveolar", voiced: false, sonority: 2, phonosemantics: FRICATIVE_UNVOICED, metadata: createMetadata(0.15, 0.9) },
  { id: "z", ipa: "z", manner: "fricative", place: "alveolar", voiced: true, sonority: 2, phonosemantics: FRICATIVE_VOICED, metadata: createMetadata(0.08, 0.9) },
  { id: "sh", ipa: "ʃ", manner: "fricative", place: "postalveolar", voiced: false, sonority: 2, phonosemantics: FRICATIVE_UNVOICED, metadata: createMetadata(0.06, 0.7) },
  { id: "zh", ipa: "ʒ", manner: "fricative", place: "postalveolar", voiced: true, sonority: 2, phonosemantics: FRICATIVE_VOICED, metadata: createMetadata(0.01, 0.2) },
  { id: "h", ipa: "h", manner: "fricative", place: "glottal", voiced: false, sonority: 2, phonosemantics: FRICATIVE_UNVOICED, metadata: createMetadata(0.06, 0.8) },

  // Consonants - Affricates
  { id: "ch", ipa: "tʃ", manner: "affricate", place: "postalveolar", voiced: false, sonority: 1.5, phonosemantics: PLOSIVE_UNVOICED, metadata: createMetadata(0.05, 0.7) },
  { id: "j", ipa: "dʒ", manner: "affricate", place: "postalveolar", voiced: true, sonority: 1.5, phonosemantics: PLOSIVE_VOICED, metadata: createMetadata(0.04, 0.7) },

  // Consonants - Nasals
  { id: "m", ipa: "m", manner: "nasal", place: "bilabial", voiced: true, sonority: 3, phonosemantics: NASAL, metadata: createMetadata(0.11, 0.9) },
  { id: "n", ipa: "n", manner: "nasal", place: "alveolar", voiced: true, sonority: 3, phonosemantics: NASAL, metadata: createMetadata(0.14, 0.9) },
  { id: "ng", ipa: "ŋ", manner: "nasal", place: "velar", voiced: true, sonority: 3, phonosemantics: NASAL, metadata: createMetadata(0.05, 0.4) },

  // Consonants - Liquids/Approximants
  { id: "l", ipa: "l", manner: "lateral", place: "alveolar", voiced: true, sonority: 4, phonosemantics: LIQUID, metadata: createMetadata(0.12, 0.9) },
  { id: "r", ipa: "r", manner: "approximant", place: "alveolar", voiced: true, sonority: 4, phonosemantics: LIQUID, metadata: createMetadata(0.13, 0.9) },
  { id: "w", ipa: "w", manner: "approximant", place: "bilabial", voiced: true, sonority: 4, phonosemantics: LIQUID, metadata: createMetadata(0.06, 0.8) },
  { id: "y", ipa: "j", manner: "approximant", place: "palatal", voiced: true, sonority: 4, phonosemantics: LIQUID, metadata: createMetadata(0.05, 0.8) },

  // Vowels - Monophthongs (Front)
  { id: "i", ipa: "i", manner: "vowel", place: "none", voiced: true, sonority: 8, phonosemantics: VOWEL_FRONT, metadata: createMetadata(0.10, 0.9) },
  { id: "ih", ipa: "ɪ", manner: "vowel", place: "none", voiced: true, sonority: 9, phonosemantics: VOWEL_FRONT, metadata: createMetadata(0.12, 0.9) },
  { id: "eh", ipa: "ɛ", manner: "vowel", place: "none", voiced: true, sonority: 9, phonosemantics: VOWEL_FRONT, metadata: createMetadata(0.09, 0.9) },
  { id: "ae", ipa: "æ", manner: "vowel", place: "none", voiced: true, sonority: 10, phonosemantics: VOWEL_FRONT, metadata: createMetadata(0.08, 0.9) },

  // Vowels - Monophthongs (Central)
  { id: "ah", ipa: "ʌ", manner: "vowel", place: "none", voiced: true, sonority: 10, phonosemantics: VOWEL_CENTRAL, metadata: createMetadata(0.07, 0.9) },
  { id: "ax", ipa: "ə", manner: "vowel", place: "none", voiced: true, sonority: 10, phonosemantics: VOWEL_CENTRAL, metadata: createMetadata(0.15, 1.0) }, // Schwa is highly productive
  { id: "er", ipa: "ɜr", manner: "vowel", place: "none", voiced: true, sonority: 9, phonosemantics: VOWEL_CENTRAL, metadata: createMetadata(0.06, 0.8) },

  // Vowels - Monophthongs (Back)
  { id: "u", ipa: "u", manner: "vowel", place: "none", voiced: true, sonority: 8, phonosemantics: VOWEL_BACK, metadata: createMetadata(0.08, 0.9) },
  { id: "uh", ipa: "ʊ", manner: "vowel", place: "none", voiced: true, sonority: 9, phonosemantics: VOWEL_BACK, metadata: createMetadata(0.05, 0.8) },
  { id: "ao", ipa: "ɔ", manner: "vowel", place: "none", voiced: true, sonority: 10, phonosemantics: VOWEL_BACK, metadata: createMetadata(0.07, 0.9) },
  { id: "aa", ipa: "ɑ", manner: "vowel", place: "none", voiced: true, sonority: 10, phonosemantics: VOWEL_BACK, metadata: createMetadata(0.08, 0.9) },

  // Vowels - Diphthongs
  { id: "ey", ipa: "eɪ", manner: "vowel", place: "none", voiced: true, sonority: 9, phonosemantics: VOWEL_FRONT, metadata: createMetadata(0.08, 0.9) },
  { id: "ay", ipa: "aɪ", manner: "vowel", place: "none", voiced: true, sonority: 10, phonosemantics: VOWEL_CENTRAL, metadata: createMetadata(0.08, 0.9) },
  { id: "oy", ipa: "ɔɪ", manner: "vowel", place: "none", voiced: true, sonority: 9, phonosemantics: VOWEL_BACK, metadata: createMetadata(0.04, 0.7) },
  { id: "aw", ipa: "aʊ", manner: "vowel", place: "none", voiced: true, sonority: 10, phonosemantics: VOWEL_CENTRAL, metadata: createMetadata(0.05, 0.8) },
  { id: "ow", ipa: "oʊ", manner: "vowel", place: "none", voiced: true, sonority: 9, phonosemantics: VOWEL_BACK, metadata: createMetadata(0.07, 0.9) },
];
