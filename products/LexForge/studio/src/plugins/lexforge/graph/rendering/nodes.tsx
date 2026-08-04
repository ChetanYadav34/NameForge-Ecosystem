import { NodeProps, Handle, Position, Node, useViewport } from "@xyflow/react";
import { SceneNode } from "../scene/types";
import { graphRegistry } from "../registry";

import { Pin } from "lucide-react";

function BaseNode({ children, selected, depth = 999, pinned, hovered }: { children: React.ReactNode, selected?: boolean, depth?: number, pinned?: boolean, hovered?: boolean }) {
  let sizeClass = "px-3 py-1 text-sm"; // Depth 2+
  if (depth === 0) sizeClass = "px-6 py-3 text-lg";
  else if (depth === 1) sizeClass = "px-4 py-2 text-base";

  let borderClass = "border-[#27272C]";
  let shadowClass = "shadow-md";

  if (depth === 0) {
    borderClass = "border-[#D4AF37]";
    shadowClass = "shadow-[0_0_15px_rgba(212,175,55,0.4)]";
  }

  if (selected) {
    borderClass = "border-accent animate-pulse";
    shadowClass = "shadow-[0_0_20px_rgba(255,255,255,0.2)]";
  } else if (hovered) {
    borderClass = "border-accent";
  }

  return (
    <div className={`${sizeClass} ${borderClass} ${shadowClass} rounded-md bg-[#161616] border-2 transition-all duration-200 relative group`}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      {pinned && (
        <div className="absolute -top-2 -right-2 bg-accent rounded-full p-1 shadow-sm">
          <Pin size={10} className="text-black" />
        </div>
      )}
      {children}
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

export function WordNodeRenderer({ data, selected }: NodeProps<Node<{ sceneNode: SceneNode }>>) {
  const node = data.sceneNode;
  const isSelected = selected || node.layerId === "selection";
  const depth = node.data?.metadata?.depth ?? 999;
  const isRoot = depth === 0;
  const isPinned = !!node.data?.metadata?.isPinned;
  const label = node.data?.label || "Unknown Word";
  const partOfSpeech = node.data?.metadata?.partOfSpeech;
  const zipf = node.data?.metadata?.zipf;
  const { zoom } = useViewport();
  
  // LOD logic
  const isDistant = zoom < 0.45 && !isRoot && !isSelected && !isPinned;
  const labelOpacity = isDistant ? "opacity-30 scale-90 blur-[0.5px]" : "opacity-100 scale-100 blur-0";

  return (
    <BaseNode selected={isSelected} depth={depth} pinned={isPinned}>
      <div className="flex flex-col items-center justify-center h-full relative group-hover:scale-105 transition-transform duration-200">
        <span className={`font-bold font-sans transition-all duration-300 ${isSelected ? 'text-accent' : 'text-foreground'} ${labelOpacity} group-hover:opacity-100 group-hover:scale-110 group-hover:blur-0`}>
          {label}
        </span>
        
        <div className={`flex items-center gap-1 mt-0.5 transition-all duration-300 ${isDistant ? 'opacity-0' : 'opacity-70'} group-hover:opacity-100`}>
          {partOfSpeech && (
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground bg-black/40 px-1 rounded-sm border border-white/5">
              {partOfSpeech}
            </span>
          )}
          {zipf && (
            <span className="text-[9px] text-accent/80 font-jetbrains-mono bg-accent/10 px-1 rounded-sm border border-accent/20">
              f:{Number(zipf).toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </BaseNode>
  );
}

export function ClusterNodeRenderer({ data }: NodeProps<Node<{ sceneNode: SceneNode }>>) {
  const label = data.sceneNode.data?.label || "Cluster";
  return (
    <div className="rounded-full px-6 py-2 shadow-md bg-[#101010] border-2 border-[#27272C] text-white">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <span className="font-bold font-sans">{label}</span>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

export function PlaceholderRenderer({ data }: NodeProps<Node<{ sceneNode: SceneNode }>>) {
  return (
    <BaseNode>
      <span className="text-muted-foreground italic">Placeholder</span>
    </BaseNode>
  );
}

// Register them
graphRegistry.registerNodeRenderer({ type: "word", component: WordNodeRenderer });
graphRegistry.registerNodeRenderer({ type: "cluster", component: ClusterNodeRenderer });
graphRegistry.registerNodeRenderer({ type: "placeholder", component: PlaceholderRenderer });
