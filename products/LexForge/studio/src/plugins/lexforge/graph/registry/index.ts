import { 
  GraphRelationshipProvider, 
  VisualizationMode, 
  LayoutEngine, 
  ToolbarAction, 
  ContextMenuAction, 
  NodeAction, 
  GraphOverlay, 
  NodeRenderer, 
  EdgeRenderer, 
  AnalyticsWidget 
} from "./types";

class VisualizationRegistry {
  public relationshipProviders = new Map<string, GraphRelationshipProvider>();
  public visualizationModes = new Map<string, VisualizationMode>();
  public layoutEngines = new Map<string, LayoutEngine>();
  public toolbarActions = new Map<string, ToolbarAction>();
  public contextMenuActions = new Map<string, ContextMenuAction>();
  public nodeActions = new Map<string, NodeAction>();
  public overlays = new Map<string, GraphOverlay>();
  public nodeRenderers = new Map<string, NodeRenderer>();
  public edgeRenderers = new Map<string, EdgeRenderer>();
  public analyticsWidgets = new Map<string, AnalyticsWidget>();

  public registerRelationshipProvider(provider: GraphRelationshipProvider) {
    this.relationshipProviders.set(provider.id, provider);
  }

  public registerVisualizationMode(mode: VisualizationMode) {
    this.visualizationModes.set(mode.id, mode);
  }

  public registerLayoutEngine(engine: LayoutEngine) {
    this.layoutEngines.set(engine.id, engine);
  }

  public registerToolbarAction(action: ToolbarAction) {
    this.toolbarActions.set(action.id, action);
  }

  public registerContextMenuAction(action: ContextMenuAction) {
    this.contextMenuActions.set(action.id, action);
  }

  public registerNodeAction(action: NodeAction) {
    this.nodeActions.set(action.id, action);
  }

  public registerOverlay(overlay: GraphOverlay) {
    this.overlays.set(overlay.id, overlay);
  }

  public registerNodeRenderer(renderer: NodeRenderer) {
    this.nodeRenderers.set(renderer.type, renderer);
  }

  public registerEdgeRenderer(renderer: EdgeRenderer) {
    this.edgeRenderers.set(renderer.type, renderer);
  }

  public registerAnalyticsWidget(widget: AnalyticsWidget) {
    this.analyticsWidgets.set(widget.id, widget);
  }
}

export const graphRegistry = new VisualizationRegistry();
export * from "./types";
