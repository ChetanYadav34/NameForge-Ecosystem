"use client";

import { useGraphStore } from "@/store/useGraphStore";
import { useEffect, useState } from "react";
import { graphRegistry } from "@/plugins/lexforge/graph/registry";
import { useReactFlow } from "@xyflow/react";

import { useGraphSessionStore } from "@/plugins/lexforge/graph/history/session";

export function GraphDiagnostics() {
  const { view, relationshipFilters, expandedNodeIds } = useGraphStore();
  const { activeLayout } = useGraphSessionStore();
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

  const V = view.nodes.length;
  const E = view.edges.length;
  const density = V > 1 ? (2 * E) / (V * (V - 1)) : 0;
  const rootNode = Array.from(expandedNodeIds)[0] || "None";
  
  // Relationship distribution
  const relDist = view.edges.reduce((acc, edge) => {
    acc[edge.relationship] = (acc[edge.relationship] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const relDistString = Object.entries(relDist)
    .sort((a, b) => b[1] - a[1])
    .map(([rel, count]) => `${rel}:${count}`)
    .join(", ");

  return (
    <div className="absolute top-4 left-4 z-50 bg-surface-elevated/90 border border-border rounded-md p-3 text-[10px] font-jetbrains-mono text-muted-foreground w-80 shadow-lg backdrop-blur-sm pointer-events-none">
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-border">
        <span className="font-bold text-foreground uppercase tracking-wider">Graph Analytics</span>
        <span className={fps < 30 ? "text-red-500" : "text-green-500"}>{fps} FPS</span>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Root Node:</span>
          <span className="text-foreground">{rootNode}</span>
        </div>
        <div className="flex justify-between">
          <span>Node Count (V):</span>
          <span className="text-foreground">{V}</span>
        </div>
        <div className="flex justify-between">
          <span>Edge Count (E):</span>
          <span className="text-foreground">{E}</span>
        </div>
        <div className="flex justify-between">
          <span>Density:</span>
          <span className="text-foreground">{density.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span>Average Degree:</span>
          <span className="text-foreground">{view.statistics.averageDegree?.toFixed(2) || (V ? (E / V).toFixed(2) : 0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Conn. Components:</span>
          <span className="text-foreground">{view.statistics.connectedComponents || 1}</span>
        </div>
        
        <div className="flex justify-between mt-1 pt-1 border-t border-border/30">
          <span>Rel. Distribution:</span>
          <span className="text-foreground max-w-[150px] truncate text-right">
            {relDistString || "None"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Active Filters:</span>
          <span className="text-foreground max-w-[150px] truncate text-right">
            {relationshipFilters.size > 0 ? Array.from(relationshipFilters).join(", ") : "All"}
          </span>
        </div>
        
        <div className="flex justify-between mt-1 pt-1 border-t border-border/30">
          <span>Layout Engine:</span>
          <span className="text-foreground">{activeLayout}</span>
        </div>
        <div className="flex justify-between">
          <span>Gen. Time:</span>
          <span className="text-foreground">{view.statistics.generatedAt ? new Date(view.statistics.generatedAt).toLocaleTimeString() : "N/A"}</span>
        </div>
      </div>
    </div>
  );
}
