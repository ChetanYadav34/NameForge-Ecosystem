import { create } from "zustand";

export interface WorkspacePanel {
  id: string;
  type: 'explorer' | 'graph' | 'compiler' | 'validation' | string;
  pluginId: string;
  title: string;
  isClosable: boolean;
}

export interface WorkspaceLayout {
  id: string;
  name: string;
  panels: WorkspacePanel[];
  activePanelId: string | null;
  splitRatio?: number; // e.g. 50% split if multiple panels
}

interface WorkspaceState {
  layouts: WorkspaceLayout[];
  activeLayoutId: string | null;
  
  createLayout: (layout: WorkspaceLayout) => void;
  setActiveLayout: (id: string) => void;
  
  openPanel: (layoutId: string, panel: WorkspacePanel) => void;
  closePanel: (layoutId: string, panelId: string) => void;
  setActivePanel: (layoutId: string, panelId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  layouts: [],
  activeLayoutId: null,

  createLayout: (layout) => set((state) => ({
    layouts: [...state.layouts, layout],
    activeLayoutId: layout.id
  })),

  setActiveLayout: (id) => set({ activeLayoutId: id }),

  openPanel: (layoutId, panel) => set((state) => {
    const layouts = state.layouts.map(layout => {
      if (layout.id === layoutId) {
        const panelExists = layout.panels.some(p => p.id === panel.id);
        if (!panelExists) {
          return {
            ...layout,
            panels: [...layout.panels, panel],
            activePanelId: panel.id
          };
        }
        return {
          ...layout,
          activePanelId: panel.id
        };
      }
      return layout;
    });
    return { layouts };
  }),

  closePanel: (layoutId, panelId) => set((state) => {
    const layouts = state.layouts.map(layout => {
      if (layout.id === layoutId) {
        const panels = layout.panels.filter(p => p.id !== panelId);
        let activePanelId = layout.activePanelId;
        if (activePanelId === panelId) {
          activePanelId = panels.length > 0 ? panels[panels.length - 1].id : null;
        }
        return { ...layout, panels, activePanelId };
      }
      return layout;
    });
    return { layouts };
  }),

  setActivePanel: (layoutId, panelId) => set((state) => {
    const layouts = state.layouts.map(layout => {
      if (layout.id === layoutId) {
        return { ...layout, activePanelId: panelId };
      }
      return layout;
    });
    return { layouts };
  })
}));
