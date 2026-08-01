"use client";

import { useGraphStore } from "@/store/useGraphStore";
import { useEffect, useState } from "react";
import { SceneNode } from "@/plugins/lexforge/graph/scene/types";
import { graphRegistry } from "@/plugins/lexforge/graph/registry";

import { Sparkles, Brain, BookOpen, Layers } from "lucide-react";

export function GraphIntelligencePanel() {
  const { view, selectedNodeId } = useGraphStore();
  const [selectedNode, setSelectedNode] = useState<SceneNode | null>(null);

  useEffect(() => {
    if (selectedNodeId) {
      const node = view.nodes.find(n => n.id === selectedNodeId);
      if (node) {
        setSelectedNode({
          id: node.id,
          x: 0, y: 0, width: 100, height: 50,
          data: node,
          isVisible: true, opacity: 1, zIndex: 0, layerId: "selection"
        });
      } else {
        setSelectedNode(null);
      }
    } else {
      setSelectedNode(null);
    }
  }, [selectedNodeId, view.nodes]);

  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-4 opacity-50">
        <Brain className="w-12 h-12" />
        <p className="text-sm">Select a node to inspect</p>
      </div>
    );
  }

  const label = selectedNode.data?.label || selectedNode.id;
  const partOfSpeech = selectedNode.data?.metadata?.partOfSpeech || "Unknown POS";
  const depth = selectedNode.data?.metadata?.depth ?? "N/A";

  return (
    <div className="h-full flex flex-col space-y-4 overflow-y-auto custom-scrollbar pr-2 pb-10">
      
      {/* Header Card */}
      <div className="p-4 bg-surface-elevated rounded-md border border-border shadow-sm">
        <h3 className="text-2xl font-space-grotesk font-bold text-accent mb-1">{label}</h3>
        <div className="flex gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-black/20 px-2 py-0.5 rounded border border-white/5">{partOfSpeech}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-black/20 px-2 py-0.5 rounded border border-white/5">Depth: {depth}</span>
        </div>
      </div>

      {/* Lexical AI Insights Placeholder */}
      <div className="p-4 bg-gradient-to-br from-accent/10 to-transparent rounded-md border border-accent/20 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-accent">Lexical Insights</h4>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Generating semantic cluster analysis for "{label}". This node appears frequently in contexts related to fire, heat, and destruction.
        </p>
      </div>

      {/* Morphological Analysis Placeholder */}
      <div className="p-4 bg-surface-elevated rounded-md border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Morphology</h4>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between border-b border-border/50 pb-1">
            <span className="text-muted-foreground">Root</span>
            <span className="text-foreground">Unknown</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-1">
            <span className="text-muted-foreground">Syllables</span>
            <span className="text-foreground">1</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-muted-foreground">Phonetics</span>
            <span className="text-foreground">/{label}/</span>
          </div>
        </div>
      </div>

      {/* Dataset Cross-reference Placeholder */}
      <div className="p-4 bg-surface-elevated rounded-md border border-border shadow-sm opacity-70">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cross-References</h4>
        </div>
        <p className="text-[10px] text-muted-foreground italic mb-2">Connecting to KnowledgeVerse...</p>
        <div className="flex flex-wrap gap-1">
          <span className="text-[9px] bg-black/40 border border-white/5 px-1.5 py-0.5 rounded text-muted-foreground">Wiktionary</span>
          <span className="text-[9px] bg-black/40 border border-white/5 px-1.5 py-0.5 rounded text-muted-foreground">WordNet</span>
        </div>
      </div>

      {/* Raw Data Accordion */}
      <details className="group border border-border rounded-md bg-surface-elevated">
        <summary className="text-xs font-bold uppercase tracking-wider text-muted-foreground p-3 cursor-pointer group-open:border-b group-open:border-border">
          Raw Graph Data
        </summary>
        <pre className="text-[10px] text-muted-foreground bg-[#090909] p-3 overflow-x-auto">
          {JSON.stringify(selectedNode.data, null, 2)}
        </pre>
      </details>
    </div>
  );
}
