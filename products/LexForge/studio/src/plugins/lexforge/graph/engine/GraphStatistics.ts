import { GraphData } from "../types/graph";

export class GraphStatistics {
  public compute(data: GraphData): any {
    const nodeCount = data.nodes.length;
    const edgeCount = data.edges.length;
    const density = nodeCount > 1 ? (2 * edgeCount) / (nodeCount * (nodeCount - 1)) : 0;
    const averageDegree = nodeCount > 0 ? (2 * edgeCount) / nodeCount : 0;

    return {
      nodeCount,
      edgeCount,
      density,
      averageDegree
    };
  }
}
