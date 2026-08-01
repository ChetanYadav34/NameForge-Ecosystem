import { LexEntry } from "../dataset/types";

export interface GraphNode {
  id: string; // word or familyId
  label: string;
  type: "word" | "family" | "definition" | "domain" | "pos" | "concept" | "resource";
  color?: string;
  size?: number;
  metadata?: Record<string, any>;
  expanded?: boolean;
  selected?: boolean;
  x?: number;
  y?: number;
}

export interface GraphRelationship {
  source: string;
  target: string;
  relationship: string;
  provider: string;
  weight?: number;
  confidence?: number;
  bidirectional?: boolean;
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  weight: number;
  direction: "directed" | "undirected";
}

export interface GraphStatistics {
  nodeCount: number;
  edgeCount: number;
  connectedComponents: number;
  averageDegree: number;
  generatedAt: string;
}

export interface GraphView {
  nodes: GraphNode[];
  edges: GraphEdge[];
  statistics: GraphStatistics;
}

export interface ExpandRequest {
  id: string;
  depth: number;
  relationships?: string[];
  maxNodes?: number;
  maxEdges?: number;
}

export interface LayoutEngine {
  id: string;
  name: string;
  layout: (view: GraphView) => GraphView;
}

export interface GraphRelationshipProvider {
  id: string;
  name: string;
  priority: number;
  relationships: string[];
  build: (word: LexEntry) => Promise<GraphRelationship[]>;
}

export interface RelationshipDefinition {
  id: string;
  label: string;
  color: string;
  visible: boolean;
  provider: string;
}
