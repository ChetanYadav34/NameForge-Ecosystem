import { GraphData } from "../types/graph";
import { GraphResolver } from "./GraphResolver";
import { GraphBuilder } from "./GraphBuilder";
import { GraphMerge } from "./GraphMerge";

export class GraphExpansion {
  constructor(
    private resolver: GraphResolver,
    private builder: GraphBuilder,
    private merger: GraphMerge
  ) {}

  public async expand(nodeId: string, currentData: GraphData, context: any): Promise<GraphData> {
    const newEdges = await this.resolver.resolveRelationships(nodeId, context);
    
    // In a real implementation, we'd also resolve the nodes for these edges
    // For now we just return current data merged with new edges
    const newData = this.builder.build([], newEdges);
    
    return this.merger.merge(currentData, newData);
  }
}
