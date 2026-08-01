"use client";

import { useGraphStore } from "@/store/useGraphStore";
import { useEffect, useState } from "react";
import { graphRegistry } from "@/plugins/lexforge/graph/registry";

export function GraphDiagnostics() {
  const { view, relationshipFilters } = useGraphStore();
  const [fps, setFps] = useState(0);
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animFrameId: number;

    const measureFPS = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animFrameId = requestAnimationFrame(measureFPS);
    };

    animFrameId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  return (
    <div className="absolute top-4 left-4 z-50 bg-surface-elevated/90 border border-border rounded-md p-3 text-[10px] font-jetbrains-mono text-muted-foreground w-64 shadow-lg backdrop-blur-sm pointer-events-none">
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-border">
        <span className="font-bold text-foreground uppercase tracking-wider">Graph Analytics</span>
        <span className={fps < 30 ? "text-red-500" : "text-green-500"}>{fps} FPS</span>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Nodes:</span>
          <span className="text-foreground">{view.statistics.nodeCount || view.nodes.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Edges:</span>
          <span className="text-foreground">{view.statistics.edgeCount || view.edges.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Density:</span>
          <span className="text-foreground">
            {view.nodes.length > 1 
              ? (view.edges.length / (view.nodes.length * (view.nodes.length - 1))).toFixed(4)
              : 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Avg Degree:</span>
          <span className="text-foreground">
            {view.nodes.length > 0 ? (view.edges.length / view.nodes.length).toFixed(2) : 0}
          </span>
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t border-border/50">
          <span>Connected Components:</span>
          <span className="text-foreground">{view.statistics.connectedComponents || 1}</span>
        </div>
      </div>
    </div>
  );
}
