"use client";

import { useEffect } from "react";
import { useExplorerStore } from "@/store/useExplorerStore";
import { SearchBar } from "./SearchBar";
import { FiltersPanel } from "./FiltersPanel";
import { ResultsList } from "./ResultsList";
import { InspectorPanel } from "./InspectorPanel";

export function ExplorerLayout() {
  const executeSearch = useExplorerStore((state) => state.executeSearch);

  // Initial load
  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Bar for Search */}
      <div className="flex-none border-b border-border bg-surface-elevated/50 p-4">
        <div className="max-w-5xl mx-auto">
          <SearchBar />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Sidebar: Filters */}
        <div className="w-64 flex-none border-r border-border bg-surface overflow-y-auto p-4 hidden md:block">
          <FiltersPanel />
        </div>

        {/* Center: Results List */}
        <div className="flex-1 overflow-y-auto p-4 bg-background">
          <ResultsList />
        </div>

        {/* Right Sidebar: Inspector */}
        <div className="w-[400px] flex-none border-l border-border bg-surface overflow-y-auto p-4 hidden lg:block">
          <InspectorPanel />
        </div>
      </div>
    </div>
  );
}
