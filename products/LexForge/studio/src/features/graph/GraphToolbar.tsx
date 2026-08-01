"use client";

import { useState } from "react";
import { graphRegistry } from "@/plugins/lexforge/graph/registry";
import { Button } from "@/components/ui/button";
import { Maximize, Undo, Redo, Download, LayoutTemplate, Layers, Search, Code, Focus, Network, CircleDashed, Orbit, GitFork } from "lucide-react";
import { useGraphStore } from "@/store/useGraphStore";
import { useGraphSessionStore } from "@/plugins/lexforge/graph/history/session";

// Hardcode icons for now since ToolbarAction.icon is string
const ICON_MAP: Record<string, any> = {
  "Maximize": Maximize,
  "Undo": Undo,
  "Redo": Redo,
  "Download": Download,
  "LayoutTemplate": LayoutTemplate,
  "Layers": Layers,
  "Search": Search,
  "Code": Code,
  "Focus": Focus
};

export function GraphToolbar() {
  const actions = Array.from(graphRegistry.toolbarActions.values());
  const [searchQuery, setSearchQuery] = useState("");
  const { expandNode } = useGraphStore();
  const { activeLayout, setActiveLayout } = useGraphSessionStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      expandNode(searchQuery.trim().toLowerCase());
      setSearchQuery("");
    }
  };

  const cycleLayout = () => {
    const layouts = ["layout.force", "layout.radial", "layout.circle", "layout.tree"];
    const idx = layouts.indexOf(activeLayout);
    setActiveLayout(layouts[(idx + 1) % layouts.length]);
  };

  const getLayoutIcon = () => {
    switch (activeLayout) {
      case "layout.force": return <Network className="w-4 h-4" />;
      case "layout.radial": return <Orbit className="w-4 h-4" />;
      case "layout.circle": return <CircleDashed className="w-4 h-4" />;
      case "layout.tree": return <GitFork className="w-4 h-4" />;
      default: return <LayoutTemplate className="w-4 h-4" />;
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 rounded-full bg-surface-elevated/90 backdrop-blur-md border border-border shadow-2xl">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <Search className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search dataset..."
          className="bg-black/50 border border-white/5 rounded-full pl-9 pr-4 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all w-48 placeholder:text-muted-foreground/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className="w-px h-6 bg-white/10 mx-1" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          title="Cycle Layout"
          onClick={cycleLayout}
          className="rounded-full w-8 h-8 text-muted-foreground hover:text-accent hover:bg-accent/10"
        >
          {getLayoutIcon()}
        </Button>
        
        {actions.map(action => {
          const Icon = ICON_MAP[action.icon] || Layers;
          return (
            <Button
              key={action.id}
              variant="ghost"
              size="icon"
              title={action.label}
              onClick={() => action.execute({})}
              className="rounded-full w-8 h-8 text-muted-foreground hover:text-accent hover:bg-accent/10"
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
