import { Node, Edge, MarkerType } from "@xyflow/react";
import { GraphNode, GraphEdge } from "@/lib/graph/types";

export function toReactFlowNodes(nodes: GraphNode[], selectedNodeId: string | null): Node[] {
  return nodes.map((node) => ({
    id: node.id,
    type: "custom", // We'll map all to a custom node type in GraphCanvas
    position: { x: node.x || 0, y: node.y || 0 },
    data: { 
      label: node.label,
      type: node.type,
      expanded: node.expanded,
      selected: node.id === selectedNodeId
    }
  }));
}

export function toReactFlowEdges(edges: GraphEdge[], activeFilters: Set<string>): Edge[] {
  return edges
    .filter(edge => activeFilters.size === 0 || activeFilters.has(edge.relationship))
    .map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: "default",
    animated: edge.relationship === "family",
    label: edge.relationship,
    style: {
      strokeWidth: edge.weight || 1,
      stroke: getEdgeColor(edge.relationship)
    },
    markerEnd: edge.direction === "directed" ? { type: MarkerType.ArrowClosed } : undefined
  }));
}

function getEdgeColor(relationship: string): string {
  // We can map this from the registry later, but for now fallback colors
  switch (relationship) {
    case "family": return "#F5F5F5";
    case "synonym": return "#D4AF37";
    case "antonym": return "#8B1E2D";
    case "hypernym": return "#9b59b6";
    case "hyponym": return "#e67e22";
    case "inflection": return "#4A90E2";
    case "derivation": return "#50E3C2";
    default: return "#9FA3A9";
  }
}
