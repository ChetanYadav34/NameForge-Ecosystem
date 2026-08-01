import { GraphData, GraphNode, GraphEdge } from "../types/graph";

export class GraphMerge {
  public merge(target: GraphData, source: GraphData): GraphData {
    const nodeMap = new Map(target.nodes.map(n => [n.id, n]));
    const edgeMap = new Map(target.edges.map(e => [e.id, e]));

    source.nodes.forEach(n => nodeMap.set(n.id, n));
    source.edges.forEach(e => edgeMap.set(e.id, e));

    return {
      nodes: Array.from(nodeMap.values()),
      edges: Array.from(edgeMap.values())
    };
  }
}
