import { create } from 'zustand';

export interface HistoryItem {
  id: string;
  name: string;
  linguisticRoot: string;
  culturalContext: string;
  savedAt: number;
}

export interface HistoryState {
  history: HistoryItem[];
  savedItems: HistoryItem[];
  
  // Actions
  addToHistory: (item: HistoryItem) => void;
  saveItem: (item: HistoryItem) => void;
  removeItem: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  savedItems: [],

  addToHistory: (item) => set((state) => ({
    history: [item, ...state.history]
  })),
  saveItem: (item) => set((state) => {
    if (state.savedItems.some(i => i.id === item.id)) return state;
    return { savedItems: [item, ...state.savedItems] };
  }),
  removeItem: (id) => set((state) => ({
    savedItems: state.savedItems.filter(i => i.id !== id),
    history: state.history.filter(i => i.id !== id)
  })),
  clearHistory: () => set({ history: [] })
}));
