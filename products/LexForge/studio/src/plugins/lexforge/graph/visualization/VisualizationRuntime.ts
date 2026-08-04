import { GraphData } from "../types/graph";
import { SceneNode, SceneEdge, SceneData } from "../scene/types";
import { LayoutEngine } from "../registry/types";

export class VisualizationRuntime {
  public convert(data: GraphData): SceneData {
    // Initial basic conversion with better initial spacing
    const sceneNodes: SceneNode[] = data.nodes.map(n => ({
      id: n.id,
      x: n.x || (Math.random() * 1500 - 750),
      y: n.y || (Math.random() * 1500 - 750),
      width: 150,
      height: 50,
      data: n,
      isVisible: true,
      opacity: 1,
      zIndex: 0,
      layerId: "base"
    }));

    const sceneEdges: SceneEdge[] = data.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      data: e,
      path: [],
      isVisible: true,
      opacity: 1,
      zIndex: 0,
      layerId: "base"
    }));

    return { nodes: sceneNodes, edges: sceneEdges };
  }

  public async applyLayout(scene: SceneData, layout: LayoutEngine): Promise<SceneData> {
    const result = await layout.applyLayout(scene.nodes, scene.edges);
    return { nodes: result.nodes, edges: result.edges };
  }

  public applyHierarchy(scene: SceneData, rootNodeIds: string[], pinnedNodeIds: string[] = []): SceneData {
    // BFS to calculate depths
    const depths = new Map<string, number>();
    const queue: { id: string, depth: number }[] = [];
    
    for (const root of rootNodeIds) {
      depths.set(root, 0);
      queue.push({ id: root, depth: 0 });
    }

    // Build adjacency list for undirected traversal
    const adj = new Map<string, string[]>();
    for (const e of scene.edges) {
      if (!adj.has(e.source)) adj.set(e.source, []);
      if (!adj.has(e.target)) adj.set(e.target, []);
      adj.get(e.source)!.push(e.target);
      adj.get(e.target)!.push(e.source);
    }

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      const neighbors = adj.get(id) || [];
      for (const n of neighbors) {
        if (!depths.has(n)) {
          depths.set(n, depth + 1);
          queue.push({ id: n, depth: depth + 1 });
        }
      }
    }

    const pinnedSet = new Set(pinnedNodeIds);

    // Apply depths to metadata
    const nodes = scene.nodes.map(n => {
      const d = depths.has(n.id) ? depths.get(n.id)! : 999;
      return {
        ...n,
        data: {
          ...n.data,
          metadata: { 
            ...n.data?.metadata, 
            depth: d,
            isPinned: pinnedSet.has(n.id)
          }
        }
      };
    });

    return { ...scene, nodes };
  }
}
