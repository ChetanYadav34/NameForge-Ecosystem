import { create } from "zustand";
import { ExplorerSearchResult, FilterState, PaginatedResult, SortMode } from "@/lib/explorer/types";
import { LexEntry } from "@/lib/dataset/types";
import { searchAction, getWordAction } from "@/app/actions/explorer";

interface ExplorerStore {
  searchQuery: string;
  searchMode: "exact" | "prefix" | "substring";
  filters: FilterState;
  sortMode: SortMode;
  page: number;
  pageSize: number;

  results: PaginatedResult<ExplorerSearchResult> | null;
  loading: boolean;
  error: string | null;

  selectedWordId: number | null;
  inspectingRecord: LexEntry | null;
  inspectingLoading: boolean;

  setSearchQuery: (query: string) => void;
  setSearchMode: (mode: "exact" | "prefix" | "substring") => void;
  setFilter: (key: string, value: any) => void;
  setSortMode: (mode: SortMode) => void;
  setPage: (page: number) => void;
  
  executeSearch: () => Promise<void>;
  selectWord: (id: number | null) => Promise<void>;
}

export const useExplorerStore = create<ExplorerStore>((set, get) => ({
  searchQuery: "",
  searchMode: "prefix",
  filters: {},
  sortMode: "alphabetical",
  page: 1,
  pageSize: 200,

  results: null,
  loading: false,
  error: null,

  selectedWordId: null,
  inspectingRecord: null,
  inspectingLoading: false,

  setSearchQuery: (query) => {
    set({ searchQuery: query, page: 1 });
    // Execute search externally via useEffect to allow debouncing
  },
  
  setSearchMode: (mode) => {
    set({ searchMode: mode, page: 1 });
    get().executeSearch();
  },

  setFilter: (key, value) => {
    const newFilters = { ...get().filters };
    if (value === undefined || value === null || value === false || value === "" || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    set({ filters: newFilters, page: 1 });
    get().executeSearch();
  },

  setSortMode: (mode) => {
    set({ sortMode: mode, page: 1 });
    get().executeSearch();
  },

  setPage: (page) => {
    set({ page });
    get().executeSearch();
  },

  executeSearch: async () => {
    const state = get();
    set({ loading: true, error: null });
    try {
      const results = await searchAction(
        state.searchQuery,
        state.searchMode,
        state.filters,
        state.sortMode,
        state.page,
        state.pageSize
      );
      set({ results, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  selectWord: async (id) => {
    if (id === null) {
      set({ selectedWordId: null, inspectingRecord: null });
      return;
    }
    set({ selectedWordId: id, inspectingLoading: true });
    try {
      const record = await getWordAction(id);
      set({ inspectingRecord: record, inspectingLoading: false });
    } catch (err) {
      set({ inspectingLoading: false });
      console.error(err);
    }
  }
}));
