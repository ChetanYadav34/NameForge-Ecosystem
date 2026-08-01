import { GraphData, GraphNode, GraphEdge } from "../types/graph";

export class GraphBuilder {
  public build(nodes: GraphNode[], edges: GraphEdge[]): GraphData {
    return { nodes, edges };
  }
}
