"use client";

import { useLayoutStore } from "@/core/layout/manager";
import { useAppStore } from "@/store/useAppStore";
import { corePlugins } from "@/core/plugin/manager";
import { IntelligenceModule } from "@/core/plugin/types";
import { useMemo } from "react";

export function ContextPanel() {
  const { isIntelligenceOpen, intelligenceWidth } = useLayoutStore();
  const { selectedEntity, selectedEntityType, selectedSource } = useAppStore();

  const activeModules = useMemo(() => {
    const context = { entity: selectedEntity, type: selectedEntityType, source: selectedSource };
    const modules: IntelligenceModule[] = [];
    
    corePlugins.getAll().forEach(plugin => {
      if (plugin.manifest.intelligenceModules) {
        plugin.manifest.intelligenceModules.forEach(mod => {
          if (mod.condition(context)) {
            modules.push(mod);
          }
        });
      }
    });

    return modules.sort((a, b) => b.priority - a.priority);
  }, [selectedEntity, selectedEntityType, selectedSource]);

  if (!isIntelligenceOpen) return null;

  return (
    <aside 
      className="border-l border-border bg-surface flex flex-col shrink-0 transition-all duration-200"
      style={{ width: intelligenceWidth }}
    >
      <div className="flex h-12 items-center px-4 border-b border-border bg-surface-elevated/30 shrink-0">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
          LexForge Intelligence
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
        {activeModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-8 px-4 border border-border border-dashed rounded-lg bg-background/50">
            <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </div>
            <h3 className="text-sm font-medium text-text-primary mb-1">No Context Available</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Select an entity to view contextual intelligence insights.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {activeModules.map(mod => (
              <div key={mod.id} className="intelligence-module">
                {mod.render({ entity: selectedEntity, type: selectedEntityType, source: selectedSource })}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3 pt-4 border-t border-border/50">
          <h4 className="text-[10px] font-semibold uppercase tracking-widest text-text-muted pl-1">Global Context</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2.5 rounded-md bg-surface-elevated border border-border hover:border-accent hover:text-accent transition-all text-xs text-text-secondary text-left">
              New Query
            </button>
            <button className="p-2.5 rounded-md bg-surface-elevated border border-border hover:border-accent hover:text-accent transition-all text-xs text-text-secondary text-left">
              Validation
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
