import { GraphData, GraphNode, GraphEdge } from "../types/graph";

export class GraphCache {
  private nodeCache = new Map<string, GraphNode>();
  private edgeCache = new Map<string, GraphEdge>();

  public addNode(node: GraphNode): void {
    this.nodeCache.set(node.id, node);
  }

  public addEdge(edge: GraphEdge): void {
    this.edgeCache.set(edge.id, edge);
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodeCache.get(id);
  }

  public getEdge(id: string): GraphEdge | undefined {
    return this.edgeCache.get(id);
  }

  public hasNode(id: string): boolean {
    return this.nodeCache.has(id);
  }

  public hasEdge(id: string): boolean {
    return this.edgeCache.has(id);
  }

  public clear(): void {
    this.nodeCache.clear();
    this.edgeCache.clear();
  }
}
