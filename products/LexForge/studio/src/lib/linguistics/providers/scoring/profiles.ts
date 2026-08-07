export type BrandArchetype = "luxury" | "tech" | "healthcare" | "finance" | "nature" | "ai" | "energy";

export interface ScoringProfile {
  readonly id: string;
  readonly archetype: BrandArchetype;
  readonly weights: {
    pronounceability: number;
    memorability: number;
    phonosemanticFit: number;
    lengthOptimal: number;
  };
  readonly targetPhonosemantics: {
    energy: number;
    warmth: number;
    luxury: number;
    precision: number;
    aggression: number;
    playfulness: number;
    elegance: number;
    trust: number;
    innovation: number;
  };
}

export const BRAND_PROFILES: Record<BrandArchetype, ScoringProfile> = {
  luxury: {
    id: "prof:luxury",
    archetype: "luxury",
    weights: { pronounceability: 0.8, memorability: 0.9, phonosemanticFit: 1.0, lengthOptimal: 0.7 },
    targetPhonosemantics: { energy: 0.4, warmth: 0.6, luxury: 1.0, precision: 0.7, aggression: 0.2, playfulness: 0.3, elegance: 1.0, trust: 0.8, innovation: 0.5 }
  },
  tech: {
    id: "prof:tech",
    archetype: "tech",
    weights: { pronounceability: 0.9, memorability: 0.8, phonosemanticFit: 0.9, lengthOptimal: 0.8 },
    targetPhonosemantics: { energy: 0.8, warmth: 0.3, luxury: 0.5, precision: 0.9, aggression: 0.6, playfulness: 0.4, elegance: 0.5, trust: 0.7, innovation: 1.0 }
  },
  healthcare: {
    id: "prof:healthcare",
    archetype: "healthcare",
    weights: { pronounceability: 1.0, memorability: 0.7, phonosemanticFit: 0.9, lengthOptimal: 0.6 },
    targetPhonosemantics: { energy: 0.3, warmth: 0.9, luxury: 0.4, precision: 0.8, aggression: 0.1, playfulness: 0.2, elegance: 0.6, trust: 1.0, innovation: 0.7 }
  },
  finance: {
    id: "prof:finance",
    archetype: "finance",
    weights: { pronounceability: 0.9, memorability: 0.8, phonosemanticFit: 1.0, lengthOptimal: 0.7 },
    targetPhonosemantics: { energy: 0.6, warmth: 0.4, luxury: 0.7, precision: 0.9, aggression: 0.5, playfulness: 0.1, elegance: 0.8, trust: 1.0, innovation: 0.6 }
  },
  nature: {
    id: "prof:nature",
    archetype: "nature",
    weights: { pronounceability: 0.8, memorability: 0.7, phonosemanticFit: 1.0, lengthOptimal: 0.5 },
    targetPhonosemantics: { energy: 0.5, warmth: 0.8, luxury: 0.5, precision: 0.4, aggression: 0.1, playfulness: 0.6, elegance: 0.7, trust: 0.8, innovation: 0.4 }
  },
  ai: {
    id: "prof:ai",
    archetype: "ai",
    weights: { pronounceability: 0.7, memorability: 0.9, phonosemanticFit: 1.0, lengthOptimal: 0.9 },
    targetPhonosemantics: { energy: 0.9, warmth: 0.2, luxury: 0.6, precision: 1.0, aggression: 0.7, playfulness: 0.3, elegance: 0.7, trust: 0.6, innovation: 1.0 }
  },
  energy: {
    id: "prof:energy",
    archetype: "energy",
    weights: { pronounceability: 0.8, memorability: 0.8, phonosemanticFit: 0.9, lengthOptimal: 0.6 },
    targetPhonosemantics: { energy: 1.0, warmth: 0.7, luxury: 0.4, precision: 0.6, aggression: 0.8, playfulness: 0.5, elegance: 0.3, trust: 0.7, innovation: 0.8 }
  }
};
