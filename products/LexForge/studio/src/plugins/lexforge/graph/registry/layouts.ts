import { graphRegistry } from "./index";
import { ForceLayout, RadialLayout, TreeLayout, CircleLayout } from "@/lib/graph/layout";
import { LayoutEngine } from "./types";
import { SceneNode, SceneEdge } from "../scene/types";

function createLayoutAdapter(coreEngine: any): LayoutEngine {
  return {
    id: "layout." + coreEngine.id,
    name: coreEngine.name,
    applyLayout: async (nodes: SceneNode[], edges: SceneEdge[]) => {
      // Map SceneNode -> GraphNode
      const graphNodes = nodes.map(n => ({
        id: n.id,
        type: n.data?.type || "word",
        label: n.data?.label || n.id,
        x: n.x,
        y: n.y,
        metadata: n.data?.metadata
      }));

      const graphEdges = edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        relationship: e.data?.type || "unknown",
        direction: "directed" as const,
        weight: 1
      }));

      const result = coreEngine.layout({ nodes: graphNodes, edges: graphEdges, statistics: { nodeCount: 0, edgeCount: 0, connectedComponents: 0, averageDegree: 0, generatedAt: "" } });

      const nodeMap = new Map(result.nodes.map((n: any) => [n.id, n]));

      const newNodes = nodes.map(n => {
        const ln = nodeMap.get(n.id) as any;
        return {
          ...n,
          x: ln?.x ?? n.x,
          y: ln?.y ?? n.y
        };
      });

      return { nodes: newNodes, edges };
    }
  };
}

graphRegistry.registerLayoutEngine(createLayoutAdapter(new ForceLayout()));
graphRegistry.registerLayoutEngine(createLayoutAdapter(new RadialLayout()));
graphRegistry.registerLayoutEngine(createLayoutAdapter(new TreeLayout()));
graphRegistry.registerLayoutEngine(createLayoutAdapter(new CircleLayout()));
