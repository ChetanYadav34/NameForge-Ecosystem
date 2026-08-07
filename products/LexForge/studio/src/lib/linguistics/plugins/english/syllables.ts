import { LinguisticMetadata } from "../../models/types";

export type SyllableStructure = "V" | "CV" | "VC" | "CVC" | "CCV" | "CCVC" | "CVCC" | "CCVCC" | "CCCV" | "CCCVC" | "CCCVCC" | "CCCVCCC";

export interface SyllableTemplate {
  readonly id: string;
  readonly structure: SyllableStructure;
  readonly maxOnset: number;
  readonly maxCoda: number;
  readonly weightAllowed: "light" | "heavy" | "any";
  readonly metadata: LinguisticMetadata;
}

const createMetadata = (freq: number, prod: number): LinguisticMetadata => ({
  frequency: freq,
  rarity: 1 - freq,
  productivity: prod,
  confidence: 1.0,
  source: "English Syllable Topology",
  version: "1.0.0"
});

export const ENGLISH_SYLLABLE_TEMPLATES: SyllableTemplate[] = [
  { id: "syl:en:v", structure: "V", maxOnset: 0, maxCoda: 0, weightAllowed: "any", metadata: createMetadata(0.05, 0.9) },
  { id: "syl:en:cv", structure: "CV", maxOnset: 1, maxCoda: 0, weightAllowed: "any", metadata: createMetadata(0.25, 1.0) },
  { id: "syl:en:vc", structure: "VC", maxOnset: 0, maxCoda: 1, weightAllowed: "heavy", metadata: createMetadata(0.10, 0.9) },
  { id: "syl:en:cvc", structure: "CVC", maxOnset: 1, maxCoda: 1, weightAllowed: "heavy", metadata: createMetadata(0.35, 1.0) },
  { id: "syl:en:ccv", structure: "CCV", maxOnset: 2, maxCoda: 0, weightAllowed: "any", metadata: createMetadata(0.08, 0.8) },
  { id: "syl:en:ccvc", structure: "CCVC", maxOnset: 2, maxCoda: 1, weightAllowed: "heavy", metadata: createMetadata(0.10, 0.8) },
  { id: "syl:en:cvcc", structure: "CVCC", maxOnset: 1, maxCoda: 2, weightAllowed: "heavy", metadata: createMetadata(0.05, 0.6) },
  { id: "syl:en:ccvcc", structure: "CCVCC", maxOnset: 2, maxCoda: 2, weightAllowed: "heavy", metadata: createMetadata(0.01, 0.3) },
  { id: "syl:en:cccv", structure: "CCCV", maxOnset: 3, maxCoda: 0, weightAllowed: "any", metadata: createMetadata(0.005, 0.1) },
  { id: "syl:en:cccvc", structure: "CCCVC", maxOnset: 3, maxCoda: 1, weightAllowed: "heavy", metadata: createMetadata(0.004, 0.1) },
  { id: "syl:en:cccvcc", structure: "CCCVCC", maxOnset: 3, maxCoda: 2, weightAllowed: "heavy", metadata: createMetadata(0.001, 0.05) },
];
