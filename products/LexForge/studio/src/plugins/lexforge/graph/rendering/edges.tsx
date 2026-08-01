import { EdgeProps, BaseEdge, getBezierPath, getStraightPath, Edge, EdgeLabelRenderer } from "@xyflow/react";
import { SceneEdge } from "../scene/types";
import { graphRegistry } from "../registry";

const RELATIONSHIP_COLORS: Record<string, string> = {
  synonym: "#3b82f6",   // Blue
  antonym: "#ef4444",   // Red
  hypernym: "#a855f7",  // Purple
  hyponym: "#22c55e",   // Green
  family: "#d4af37",    // Gold
  derivation: "#f97316",// Orange
  inflection: "#06b6d4" // Cyan
};

export function DefaultEdgeRenderer({ id, sourceX, sourceY, targetX, targetY, data }: EdgeProps<Edge<{ sceneEdge: SceneEdge }>>) {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  const isSelected = data?.sceneEdge.layerId === "selection";
  const relationship = data?.sceneEdge.data?.type || "unknown";
  
  const baseColor = RELATIONSHIP_COLORS[relationship.toLowerCase()] || "#27272C";
  const color = isSelected ? "#D4AF37" : baseColor;
  
  return (
    <>
      <BaseEdge 
        id={id} 
        path={edgePath} 
        style={{
          stroke: color,
          strokeWidth: isSelected ? 3 : 2,
          opacity: data?.sceneEdge.opacity || 0.6
        }} 
      />
      <EdgeLabelRenderer>
        <div
          className="absolute text-[10px] font-sans font-bold bg-[#161616] text-muted-foreground border border-[#27272C] rounded-full px-2 py-0.5 pointer-events-none opacity-0 transition-opacity duration-200"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          {relationship}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export function FamilyEdgeRenderer({ id, sourceX, sourceY, targetX, targetY, data }: EdgeProps<Edge<{ sceneEdge: SceneEdge }>>) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return (
    <BaseEdge 
      id={id} 
      path={edgePath} 
      style={{
        stroke: "#F5F5F5",
        strokeWidth: 2,
        strokeDasharray: "5,5",
        opacity: data?.sceneEdge.opacity || 1
      }} 
    />
  );
}

// Register
graphRegistry.registerEdgeRenderer({ type: "default", component: DefaultEdgeRenderer });
graphRegistry.registerEdgeRenderer({ type: "family", component: FamilyEdgeRenderer });
