import { create } from 'zustand';

export interface Seed {
  id: string;
  type: string;
  value: string;
}

export interface GenerationResult {
  name: string;
  strategySource: string;
  scores: {
    generationComposite: number;
    brandability: number;
    humanShortlistScore: number;
    availabilityRisk: number;
    mutationQuality: number;
    originalScore: number;
  };
  availability: {
    companyConflict: { status: string; confidence: number; provider: string; checkedAt: string };
    trademark: { status: string; confidence: number; provider: string; checkedAt: string };
    domains: {
      com: { status: string; confidence: number; provider: string; checkedAt: string };
      io: { status: string; confidence: number; provider: string; checkedAt: string };
      ai: { status: string; confidence: number; provider: string; checkedAt: string };
      co: { status: string; confidence: number; provider: string; checkedAt: string };
    };
  };
}

export interface GenerationState {
  currentInput: string;
  seeds: Seed[];
  isGenerating: boolean;
  fsmState: string;
  results: GenerationResult[];
  
  // Actions
  setInput: (input: string) => void;
  addSeed: (seed: Omit<Seed, 'id'>) => void;
  removeSeed: (id: string) => void;
  setGenerating: (isGenerating: boolean) => void;
  setFsmState: (state: string) => void;
  addResult: (result: GenerationResult) => void;
  clearResults: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  currentInput: '',
  seeds: [],
  isGenerating: false,
  fsmState: 'IDLE',
  results: [],

  setInput: (input) => set({ currentInput: input }),
  addSeed: (seed) => set((state) => ({ 
    seeds: [...state.seeds, { ...seed, id: crypto.randomUUID() }] 
  })),
  removeSeed: (id) => set((state) => ({ 
    seeds: state.seeds.filter((s) => s.id !== id) 
  })),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setFsmState: (fsmState) => set({ fsmState }),
  addResult: (result) => set((state) => ({ 
    results: [...state.results, result] 
  })),
  clearResults: () => set({ results: [] })
}));
