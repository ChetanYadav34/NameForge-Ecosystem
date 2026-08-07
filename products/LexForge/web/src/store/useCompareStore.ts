import { create } from 'zustand';

export interface CompareItem {
  id: string;
  name: string;
  linguisticRoot: string;
  culturalContext: string;
}

export interface CompareState {
  items: CompareItem[];
  isComparing: boolean;
  
  // Actions
  addItem: (item: CompareItem) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  setComparing: (isComparing: boolean) => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  items: [],
  isComparing: false,

  addItem: (item) => set((state) => {
    if (state.items.some(i => i.id === item.id) || state.items.length >= 3) return state;
    return { items: [...state.items, item] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id)
  })),
  clearItems: () => set({ items: [] }),
  setComparing: (isComparing) => set({ isComparing })
}));
