import { GraphData, GraphNode } from "../types/graph";

export interface IGraphAlgorithm {
  id: string;
  name: string;
  execute(data: GraphData, options?: any): any;
}

export interface IPageRankAlgorithm extends IGraphAlgorithm {
  execute(data: GraphData, options?: { dampingFactor?: number; maxIterations?: number }): Map<string, number>;
}

export interface ICommunityDetectionAlgorithm extends IGraphAlgorithm {
  execute(data: GraphData): Map<string, string>; // NodeId -> CommunityId
}

export interface ICentralityAlgorithm extends IGraphAlgorithm {
  execute(data: GraphData): Map<string, number>; // NodeId -> Centrality Score
}

export interface IAIRankingAlgorithm extends IGraphAlgorithm {
  execute(data: GraphData, options: { contextQuery: string }): Promise<Map<string, number>>; // NodeId -> Relevance Score
}
