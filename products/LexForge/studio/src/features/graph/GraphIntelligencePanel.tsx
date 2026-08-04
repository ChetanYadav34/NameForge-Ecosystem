import "client-only";
import { useGraphStore } from "@/store/useGraphStore";
import { useEffect, useState } from "react";
import { SceneNode } from "@/plugins/lexforge/graph/scene/types";
import { Sparkles, Brain, BookOpen, Layers } from "lucide-react";
import { commandManager } from "@/plugins/lexforge/graph/actions";
import { Lock, Unlock, Loader2 } from "lucide-react";
import { getWordDetailsAction } from "@/app/actions/explorer";

export function GraphIntelligencePanel() {
  const { view, selectedNodeId } = useGraphStore();
  const [selectedNode, setSelectedNode] = useState<SceneNode | null>(null);
  const [wordData, setWordData] = useState<any | null>(null);
  const [loadingWord, setLoadingWord] = useState(false);

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
        
        // Fetch detailed lexical data
        setLoadingWord(true);
        getWordDetailsAction(node.id).then(data => {
          setWordData(data);
          setLoadingWord(false);
        }).catch(err => {
          console.error("Failed to load word details", err);
          setLoadingWord(false);
        });
      } else {
        setSelectedNode(null);
        setWordData(null);
      }
    } else {
      setSelectedNode(null);
      setWordData(null);
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
  const partOfSpeech = wordData?.pos || selectedNode.data?.metadata?.partOfSpeech || "Unknown POS";
  const depth = selectedNode.data?.metadata?.depth ?? "N/A";
  const isPinned = !!selectedNode.data?.metadata?.isPinned;

  const handleTogglePin = () => {
    commandManager.execute("graph.pinNode", { sessionId: "default" }, { nodeId: selectedNode.id });
  };

  return (
    <div className="h-full flex flex-col space-y-4 overflow-y-auto custom-scrollbar pr-2 pb-10">
      
      {/* Header Card */}
      <div className="p-4 bg-surface-elevated rounded-md border border-border shadow-sm relative">
        <button 
          onClick={handleTogglePin}
          className={`absolute top-4 right-4 p-1.5 rounded-md transition-colors ${isPinned ? 'bg-accent text-black' : 'bg-black/20 text-muted-foreground hover:text-accent hover:bg-black/40'}`}
          title={isPinned ? "Unlock Node" : "Lock Node"}
        >
          {isPinned ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>
        <h3 className="text-2xl font-space-grotesk font-bold text-accent mb-1 mr-8">{label}</h3>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-black/20 px-2 py-0.5 rounded border border-white/5">{partOfSpeech}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-black/20 px-2 py-0.5 rounded border border-white/5">Depth: {depth}</span>
          {loadingWord && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground ml-auto" />}
        </div>
      </div>

      {/* Definitions */}
      <div className="p-4 bg-gradient-to-br from-accent/10 to-transparent rounded-md border border-accent/20 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-accent">Definitions</h4>
        </div>
        {wordData?.definitions && wordData.definitions.length > 0 ? (
          <ul className="text-xs text-foreground leading-relaxed space-y-2 list-disc pl-4">
            {wordData.definitions.slice(0, 3).map((def: string, i: number) => (
              <li key={i}>{def}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            {loadingWord ? "Loading dictionary definitions..." : "No definitions available for this term."}
          </p>
        )}
      </div>

      {/* Morphological Analysis */}
      <div className="p-4 bg-surface-elevated rounded-md border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Morphology</h4>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between border-b border-border/50 pb-1">
            <span className="text-muted-foreground">Syllables</span>
            <span className="text-foreground">{wordData?.syllableCount || "Unknown"}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-1">
            <span className="text-muted-foreground">Phonetics (IPA)</span>
            <span className="text-foreground">{wordData?.ipa || `/${label}/`}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-1">
            <span className="text-muted-foreground">Zipf Frequency</span>
            <span className="text-foreground">{wordData?.zipf ? Number(wordData.zipf).toFixed(2) : "Unknown"}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-muted-foreground">Language</span>
            <span className="text-foreground">en</span>
          </div>
        </div>
      </div>

      {/* Dataset Cross-reference */}
      <div className="p-4 bg-surface-elevated rounded-md border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Sources & AI Analysis</h4>
        </div>
        <p className="text-[10px] text-muted-foreground italic mb-2">No AI analysis is available yet.</p>
        <div className="flex flex-wrap gap-1">
          {wordData?.synonyms && wordData.synonyms.length > 0 && <span className="text-[9px] bg-black/40 border border-white/5 px-1.5 py-0.5 rounded text-muted-foreground">Synonyms ({wordData.synonyms.length})</span>}
          {wordData?.antonyms && wordData.antonyms.length > 0 && <span className="text-[9px] bg-black/40 border border-white/5 px-1.5 py-0.5 rounded text-muted-foreground">Antonyms ({wordData.antonyms.length})</span>}
          {wordData?.hypernyms && wordData.hypernyms.length > 0 && <span className="text-[9px] bg-black/40 border border-white/5 px-1.5 py-0.5 rounded text-muted-foreground">Hypernyms ({wordData.hypernyms.length})</span>}
          {wordData?.hyponyms && wordData.hyponyms.length > 0 && <span className="text-[9px] bg-black/40 border border-white/5 px-1.5 py-0.5 rounded text-muted-foreground">Hyponyms ({wordData.hyponyms.length})</span>}
        </div>
      </div>

      {/* Raw Data Accordion */}
      <details className="group border border-border rounded-md bg-surface-elevated mt-auto">
        <summary className="text-xs font-bold uppercase tracking-wider text-muted-foreground p-3 cursor-pointer group-open:border-b group-open:border-border">
          Developer Data (JSON)
        </summary>
        <pre className="text-[10px] text-muted-foreground bg-[#090909] p-3 overflow-x-auto max-h-64">
          {JSON.stringify({ sceneNode: selectedNode.data, wordData }, null, 2)}
        </pre>
      </details>
    </div>
  );
}
