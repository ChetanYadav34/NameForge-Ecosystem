import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LayoutState {
  // Global Shell Panels
  isSidebarOpen: boolean;
  sidebarWidth: number;
  
  isIntelligenceOpen: boolean;
  intelligenceWidth: number;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  
  toggleIntelligence: () => void;
  setIntelligenceWidth: (width: number) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      sidebarWidth: 210,
      
      isIntelligenceOpen: false,
      intelligenceWidth: 320,
      
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarWidth: (width) => set({ sidebarWidth: Math.max(200, Math.min(width, 400)) }),
      
      toggleIntelligence: () => set((state) => ({ isIntelligenceOpen: !state.isIntelligenceOpen })),
      setIntelligenceWidth: (width) => set({ intelligenceWidth: Math.max(250, Math.min(width, 600)) }),
    }),
    {
      name: "nameforge-layout-storage",
    }
  )
);
