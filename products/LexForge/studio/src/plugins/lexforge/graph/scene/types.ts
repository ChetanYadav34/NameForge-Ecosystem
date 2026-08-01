export interface SceneBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SceneViewport {
  x: number;
  y: number;
  zoom: number;
  bounds: SceneBounds;
}

export interface SceneCamera {
  viewport: SceneViewport;
  pan(dx: number, dy: number): void;
  zoom(factor: number): void;
  focus(bounds: SceneBounds): void;
  fit(): void;
  animate(targetViewport: SceneViewport, durationMs: number): void;
}

export interface SceneNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: any; // Mapped from GraphNode.data
  isVisible: boolean;
  opacity: number;
  zIndex: number;
  layerId: string;
}

export interface SceneEdge {
  id: string;
  source: string;
  target: string;
  data: any; // Mapped from GraphEdge.data
  path: { x: number, y: number }[]; // Routing path
  isVisible: boolean;
  opacity: number;
  zIndex: number;
  layerId: string;
}

export interface SceneLayer {
  id: string;
  name: string;
  zIndex: number;
  isVisible: boolean;
}

export interface SceneSelection {
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
}

export interface SceneData {
  nodes: SceneNode[];
  edges: SceneEdge[];
}
