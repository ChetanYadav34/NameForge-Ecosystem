"use client";

import { useExplorerStore } from "@/store/useExplorerStore";
import { Loader2 } from "lucide-react";
import { ExplorerSearchResult } from "@/lib/explorer/types";
import { cn } from "@/lib/utils";

function ResultCard({ entry, isSelected, onClick }: { entry: ExplorerSearchResult; isSelected: boolean; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group p-5 border border-transparent border-b-border cursor-pointer transition-all duration-200 ease-out hover:bg-surface hover:border-border",
        isSelected ? "bg-surface-elevated border-l-[3px] border-l-accent border-y-border/50" : "bg-transparent"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className={cn(
          "text-lg font-bold font-heading transition-colors", 
          isSelected ? "text-accent" : "text-text-primary group-hover:text-accent"
        )}>
          {entry.word}
        </h3>
        {entry.zipf !== undefined && (
          <span className="text-xs font-mono text-text-muted bg-surface-elevated px-2 py-1 rounded">
            Z: {entry.zipf.toFixed(2)}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {entry.partOfSpeech.map(pos => (
          <span key={pos} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent-muted text-accent uppercase tracking-wider border border-accent/20">
            {pos}
          </span>
        ))}
        {entry.sources.map(src => (
          <span key={src} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-elevated text-text-secondary uppercase tracking-wider border border-border">
            {src}
          </span>
        ))}
        {entry.familyId && (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 uppercase tracking-wider border border-emerald-500/20">
            Family
          </span>
        )}
      </div>
    </div>
  );
}

export function ResultsList() {
  const { results, loading, error, selectedWordId, selectWord, page, setPage } = useExplorerStore();

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-danger">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (loading && !results) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Searching dataset...</p>
      </div>
    );
  }

  if (!results || results.results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p>No results found.</p>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-none p-2 border-b border-border text-xs text-muted-foreground flex justify-between items-center">
        <span>{results.total.toLocaleString()} results found</span>
        <div className="flex items-center space-x-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-2 py-1 bg-surface-elevated border border-border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>Page {page}</span>
          <button 
            disabled={!results.hasNext}
            onClick={() => setPage(page + 1)}
            className="px-2 py-1 bg-surface-elevated border border-border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {results.results.map((entry) => (
          <ResultCard 
            key={entry.id} 
            entry={entry} 
            isSelected={selectedWordId === entry.id}
            onClick={() => selectWord(entry.id)}
          />
        ))}
        {loading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm z-10">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
