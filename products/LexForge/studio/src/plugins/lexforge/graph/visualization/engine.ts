import { create } from 'zustand';

export interface VisualizationState {
  mode: string;
  setMode: (mode: string) => void;
}

export const useVisualizationStore = create<VisualizationState>((set) => ({
  mode: 'graph',
  setMode: (mode) => set({ mode })
}));
