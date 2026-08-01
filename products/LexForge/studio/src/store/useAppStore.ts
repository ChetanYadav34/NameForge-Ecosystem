import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeName } from "@/design/themes";

export interface WorkspaceTab {
  id: string;
  title: string;
  icon?: string;
  pluginId: string;
  route: string;
  isDirty?: boolean;
}

interface AppState {
  // OS Level State
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  
  // Navigation & Workspaces
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string | null) => void;
  
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  
  activeDatasetId: string | null;
  setActiveDatasetId: (id: string | null) => void;

  // Tabs
  workspaceTabs: WorkspaceTab[];
  activeTabId: string | null;
  openTab: (tab: WorkspaceTab) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;

  // Global Context (replaces Inspector specific state)
  selectedEntity: any | null;
  selectedEntityType: string | null;
  selectedSource: string | null;
  setSelectedEntity: (type: string | null, entity: any | null, source?: string) => void;

  // Window Layout
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  intelligenceCollapsed: boolean;
  setIntelligenceCollapsed: (collapsed: boolean) => void;

  // Session History & Persistence
  recentSearches: string[];
  addRecentSearch: (query: string) => void;

  recentProjects: string[];
  addRecentProject: (projectId: string) => void;

  commandHistory: string[];
  addCommandHistory: (commandId: string) => void;

  pinnedItems: string[];
  togglePinnedItem: (itemId: string) => void;

  // Global Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'lexforge-dark',
      setTheme: (theme) => set({ theme }),

      activeWorkspaceId: null,
      setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),

      activeProjectId: null,
      setActiveProjectId: (id) => set({ activeProjectId: id }),

      activeDatasetId: null,
      setActiveDatasetId: (id) => set({ activeDatasetId: id }),

      workspaceTabs: [],
      activeTabId: null,
      openTab: (tab) => {
        const { workspaceTabs } = get();
        if (!workspaceTabs.find((t) => t.id === tab.id)) {
          set({ workspaceTabs: [...workspaceTabs, tab], activeTabId: tab.id });
        } else {
          set({ activeTabId: tab.id });
        }
      },
      closeTab: (tabId) => {
        const { workspaceTabs, activeTabId } = get();
        const newTabs = workspaceTabs.filter((t) => t.id !== tabId);
        
        let newActiveId = activeTabId;
        if (activeTabId === tabId) {
          const index = workspaceTabs.findIndex((t) => t.id === tabId);
          if (newTabs.length > 0) {
            newActiveId = newTabs[Math.max(0, index - 1)].id;
          } else {
            newActiveId = null;
          }
        }
        set({ workspaceTabs: newTabs, activeTabId: newActiveId });
      },
      setActiveTab: (tabId) => set({ activeTabId: tabId }),

      selectedEntity: null,
      selectedEntityType: null,
      selectedSource: null,
      setSelectedEntity: (type, entity, source) => set({
        selectedEntityType: type,
        selectedEntity: entity,
        selectedSource: source
      }),

      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      intelligenceCollapsed: false,
      setIntelligenceCollapsed: (collapsed) => set({ intelligenceCollapsed: collapsed }),

      recentSearches: [],
      addRecentSearch: (query) => set((state) => {
        const filtered = state.recentSearches.filter(q => q !== query);
        return { recentSearches: [query, ...filtered].slice(0, 10) };
      }),

      recentProjects: [],
      addRecentProject: (projectId) => set((state) => {
        const filtered = state.recentProjects.filter(p => p !== projectId);
        return { recentProjects: [projectId, ...filtered].slice(0, 10) };
      }),

      commandHistory: [],
      addCommandHistory: (commandId) => set((state) => {
        const filtered = state.commandHistory.filter(c => c !== commandId);
        return { commandHistory: [commandId, ...filtered].slice(0, 20) };
      }),

      pinnedItems: [],
      togglePinnedItem: (itemId) => set((state) => {
        const isPinned = state.pinnedItems.includes(itemId);
        if (isPinned) {
          return { pinnedItems: state.pinnedItems.filter(id => id !== itemId) };
        } else {
          return { pinnedItems: [...state.pinnedItems, itemId] };
        }
      }),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      globalSearchOpen: false,
      setGlobalSearchOpen: (open) => set({ globalSearchOpen: open }),
    }),
    {
      name: "nameforge-os-storage",
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        intelligenceCollapsed: state.intelligenceCollapsed,
        workspaceTabs: state.workspaceTabs,
        activeTabId: state.activeTabId,
        activeWorkspaceId: state.activeWorkspaceId,
        recentSearches: state.recentSearches,
        recentProjects: state.recentProjects,
        commandHistory: state.commandHistory,
        pinnedItems: state.pinnedItems
      }),
    }
  )
);
