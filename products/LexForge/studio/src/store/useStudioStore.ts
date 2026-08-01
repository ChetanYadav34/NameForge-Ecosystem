import { create } from "zustand";

interface StudioState {
  currentView: string;
  selectedItem: string | null;
  datasetLoaded: boolean;
  datasetVersion: string | null;
  searchQuery: string;
  commandPaletteOpen: boolean;
  
  // Actions
  setCurrentView: (view: string) => void;
  setSelectedItem: (item: string | null) => void;
  setDatasetLoaded: (loaded: boolean, version?: string) => void;
  setSearchQuery: (query: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  currentView: "home",
  selectedItem: null,
  datasetLoaded: false,
  datasetVersion: null,
  searchQuery: "",
  commandPaletteOpen: false,
  
  setCurrentView: (view) => set({ currentView: view }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  setDatasetLoaded: (loaded, version) => set({ datasetLoaded: loaded, datasetVersion: version || null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
