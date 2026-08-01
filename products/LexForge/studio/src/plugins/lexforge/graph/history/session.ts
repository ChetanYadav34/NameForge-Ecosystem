import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

export interface GraphSessionState {
  sessionId: string;
  viewport: ViewportState;
  expandedNodes: string[];
  selectedNodes: string[];
  selectedEdges: string[];
  pinnedNodes: string[];
  hiddenNodes: string[];
  activeLayout: string;
  activeFilters: Record<string, boolean>;
  
  // Actions
  setViewport: (viewport: ViewportState) => void;
  setExpandedNodes: (nodes: string[]) => void;
  setSelectedNodes: (nodes: string[]) => void;
  setSelectedEdges: (edges: string[]) => void;
  setPinnedNodes: (nodes: string[]) => void;
  setHiddenNodes: (nodes: string[]) => void;
  setActiveLayout: (layoutId: string) => void;
  setActiveFilters: (filters: Record<string, boolean>) => void;
  resetSession: () => void;
}

export const useGraphSessionStore = create<GraphSessionState>()(
  persist(
    (set) => ({
      sessionId: 'default',
      viewport: { x: 0, y: 0, zoom: 1 },
      expandedNodes: [],
      selectedNodes: [],
      selectedEdges: [],
      pinnedNodes: [],
      hiddenNodes: [],
      activeLayout: 'layout.force',
      activeFilters: {},
      
      setViewport: (viewport) => set({ viewport }),
      setExpandedNodes: (expandedNodes) => set({ expandedNodes }),
      setSelectedNodes: (selectedNodes) => set({ selectedNodes }),
      setSelectedEdges: (selectedEdges) => set({ selectedEdges }),
      setPinnedNodes: (pinnedNodes) => set({ pinnedNodes }),
      setHiddenNodes: (hiddenNodes) => set({ hiddenNodes }),
      setActiveLayout: (activeLayout) => set({ activeLayout }),
      setActiveFilters: (activeFilters) => set({ activeFilters }),
      resetSession: () => set({
        viewport: { x: 0, y: 0, zoom: 1 },
        expandedNodes: [],
        selectedNodes: [],
        selectedEdges: [],
        pinnedNodes: [],
        hiddenNodes: [],
        activeFilters: {}
      })
    }),
    {
      name: 'nameforge-graph-session'
    }
  )
);
