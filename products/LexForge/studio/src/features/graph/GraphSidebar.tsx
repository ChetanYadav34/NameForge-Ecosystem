"use client";

import { useGraphStore } from "@/store/useGraphStore";
import { graphRegistry } from "@/plugins/lexforge/graph/registry";

export function GraphSidebar() {
  const { relationshipFilters, toggleRelationship } = useGraphStore();
  
  const providers = Array.from(graphRegistry.relationshipProviders.values());
  const visualizationModes = Array.from(graphRegistry.visualizationModes.values());
  const layouts = Array.from(graphRegistry.layoutEngines.values());

  return (
    <div className="w-72 h-full bg-surface border-r border-border flex flex-col overflow-y-auto custom-scrollbar">
      {/* Visualization Modes */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Visualization Mode</h2>
        <div className="space-y-3">
          {visualizationModes.map(mode => (
            <div key={mode.id} className="flex items-center space-x-2">
              <input type="radio" name="visMode" id={mode.id} className="text-accent focus:ring-accent" />
              <label htmlFor={mode.id} className="text-sm text-foreground font-medium cursor-pointer">
                {mode.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Layouts */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Layout Engine</h2>
        <div className="space-y-3">
          {layouts.map(layout => (
            <div key={layout.id} className="flex items-center space-x-2">
              <input type="radio" name="layoutEngine" id={layout.id} className="text-accent focus:ring-accent" />
              <label htmlFor={layout.id} className="text-sm text-foreground font-medium cursor-pointer">
                {layout.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Relationship Providers */}
      <div className="p-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Relationships</h2>
        <div className="space-y-3">
          {providers.map((def) => {
            const isActive = relationshipFilters.has(def.id) || relationshipFilters.size === 0;
            return (
              <div key={def.id} className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id={`rel-${def.id}`} 
                  checked={isActive}
                  onChange={() => toggleRelationship(def.id)}
                  className="text-accent focus:ring-accent"
                />
                <label htmlFor={`rel-${def.id}`} className="text-sm text-foreground font-medium cursor-pointer">
                  {def.name}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
