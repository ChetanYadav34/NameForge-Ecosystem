"use client";

import { GraphCanvas } from "./GraphCanvas";
import { GraphToolbar } from "./GraphToolbar";
import { GraphSidebar } from "./GraphSidebar";
import { GraphIntelligencePanel } from "./GraphIntelligencePanel";
import { GraphDiagnostics } from "./GraphDiagnostics";

export function GraphLayout() {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 flex overflow-hidden">
        <GraphSidebar />
        <div className="flex-1 relative">
          <GraphDiagnostics />
          <GraphToolbar />
          <GraphCanvas />
        </div>
        <div className="w-96 border-l border-border bg-[#101010] flex flex-col">
          <div className="p-4 border-b border-border bg-surface-elevated">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Intelligence</h2>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <GraphIntelligencePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
