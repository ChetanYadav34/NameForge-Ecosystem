import { create } from 'zustand';

export interface Seed {
  id: string;
  type: string;
  value: string;
}

export interface GenerationResult {
  id: string;
  name: string;
  pronunciation: string;
  meaning: string;
  linguisticRoot: string;
  culturalContext: string;
  semanticScore: number;
  brandScore: number;
  availability: boolean;
  
  // Future extensions
  domainStatus?: string;
  trademarkStatus?: string;
  socialHandleStatus?: string;
  collisionRisk?: string;
  reasoning?: string;
  generationStrategy?: string;
  engineVersion?: string;
  pipelineVersion?: string;
  datasetVersion?: string;
  emotionProfile?: { trust: number; luxury: number };
  brandArchetype?: string;
  phoneticScore?: number;
  psychologyScore?: number;
  originalityScore?: number;
  confidence?: number;
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
