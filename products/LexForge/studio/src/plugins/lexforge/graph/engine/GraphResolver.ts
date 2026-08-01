import { graphRegistry } from "../registry";
import { GraphEdge } from "../types/graph";

export class GraphResolver {
  public async resolveRelationships(nodeId: string, context: any): Promise<GraphEdge[]> {
    const edges: GraphEdge[] = [];
    const providers = Array.from(graphRegistry.relationshipProviders.values());
    
    for (const provider of providers) {
      const resolved = await provider.resolveRelationships(nodeId, context);
      // For now we just push the raw resolved edges
      // A more robust implementation would map them to GraphEdge
      edges.push(...resolved);
    }
    
    return edges;
  }
}
