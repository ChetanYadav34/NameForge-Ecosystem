"use client";

import { useExplorerStore } from "@/store/useExplorerStore";
import { Search, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchBar() {
  const { searchQuery, searchMode, loading, setSearchQuery, setSearchMode } = useExplorerStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 300);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  return (
    <div className="flex items-center space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search LexForge dataset..."
          className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-foreground"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>
      
      <select 
        className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground"
        value={searchMode}
        onChange={(e) => setSearchMode(e.target.value as any)}
      >
        <option value="prefix">Prefix</option>
        <option value="exact">Exact</option>
        <option value="substring">Substring</option>
      </select>
    </div>
  );
}
