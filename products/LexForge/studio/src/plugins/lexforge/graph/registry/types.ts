export interface GraphRelationshipProvider {
  id: string;
  name: string;
  description?: string;
  resolveRelationships: (nodeId: string, context: any) => Promise<any[]>;
}

export interface VisualizationMode {
  id: string;
  name: string;
  description?: string;
  component: React.ComponentType<any>;
}

import { SceneNode, SceneEdge } from "../scene/types";

export interface LayoutEngine {
  id: string;
  name: string;
  description?: string;
  applyLayout: (nodes: SceneNode[], edges: SceneEdge[], options?: any) => Promise<{ nodes: SceneNode[], edges: SceneEdge[] }>;
}

export interface ToolbarAction {
  id: string;
  icon: string;
  label: string;
  execute: (context: any) => void | Promise<void>;
  group?: string;
  order?: number;
}

export interface ContextMenuAction {
  id: string;
  label: string;
  icon?: string;
  execute: (nodeIds: string[], context: any) => void | Promise<void>;
  condition?: (nodeIds: string[], context: any) => boolean;
}

export interface NodeAction {
  id: string;
  label: string;
  icon?: string;
  execute: (nodeId: string, context: any) => void | Promise<void>;
}

export interface GraphOverlay {
  id: string;
  name: string;
  render: (context: any) => React.ReactNode;
}

export interface NodeRenderer {
  type: string;
  component: React.ComponentType<any>;
}

export interface EdgeRenderer {
  type: string;
  component: React.ComponentType<any>;
}

export interface AnalyticsWidget {
  id: string;
  name: string;
  render: (stats: any) => React.ReactNode;
  order?: number;
}
