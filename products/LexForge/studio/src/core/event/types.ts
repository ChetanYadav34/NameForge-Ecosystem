export enum EventType {
  EntitySelected = "EntitySelected",
  WorkspaceOpened = "WorkspaceOpened",
  WorkspaceClosed = "WorkspaceClosed",
  PluginLoaded = "PluginLoaded",
  PluginActivated = "PluginActivated",
  ThemeChanged = "ThemeChanged",
  DatasetLoaded = "DatasetLoaded",
  CommandExecuted = "CommandExecuted",
  
  // Graph Events
  GraphLoaded = "GraphLoaded",
  NodeExpanded = "NodeExpanded",
  NodeCollapsed = "NodeCollapsed",
  SelectionChanged = "SelectionChanged",
  LayoutChanged = "LayoutChanged",
  StatisticsUpdated = "StatisticsUpdated",
  TraversalCompleted = "TraversalCompleted"
}

export interface EventPayloadMap {
  [EventType.EntitySelected]: { entityType: string; entityId: string; source?: string; metadata?: any };
  [EventType.WorkspaceOpened]: { workspaceId: string; pluginId?: string };
  [EventType.WorkspaceClosed]: { workspaceId: string };
  [EventType.PluginLoaded]: { pluginId: string; version: string };
  [EventType.PluginActivated]: { pluginId: string };
  [EventType.ThemeChanged]: { themeId: string };
  [EventType.DatasetLoaded]: { datasetId: string; version: string; nodes: number };
  [EventType.CommandExecuted]: { commandId: string; args?: any };
  
  // Graph Events
  [EventType.GraphLoaded]: { rootNodeId: string; nodeCount: number; edgeCount: number };
  [EventType.NodeExpanded]: { nodeId: string; addedNodes: number; addedEdges: number };
  [EventType.NodeCollapsed]: { nodeId: string; removedNodes: number; removedEdges: number };
  [EventType.SelectionChanged]: { selectedNodeIds: string[]; selectedEdgeIds: string[] };
  [EventType.LayoutChanged]: { layoutId: string };
  [EventType.StatisticsUpdated]: { statistics: any };
  [EventType.TraversalCompleted]: { path: string[]; durationMs: number };
}
