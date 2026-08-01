# Knowledge Visualization Framework SDK

The Knowledge Visualization Framework is the official rendering and interaction engine for graphs, trees, and other relational data visualizations within the NameForge Ecosystem.

## 1. Core Architecture

The framework is decoupled from any specific renderer (like React Flow) and relies on a central `VisualizationEngine` and a `GraphEngine` for data processing.

- **GraphEngine**: Handles data fetching, neighborhood expansion, and algorithmic traversal.
- **VisualizationRegistry**: Registers all plugins, renderers, layouts, and actions.
- **VisualizationEngine**: Manages global visualization state (current mode, viewport, active layout).

## 2. Visualization Registry

Everything in the framework is extensible via the `graphRegistry`.

```typescript
import { graphRegistry } from "@/plugins/lexforge/graph/registry";

// Registering a Relationship Provider
graphRegistry.registerRelationshipProvider({
  id: "word-family",
  name: "Word Family",
  resolveRelationships: async (nodeId, context) => {
    // Return edges
  }
});
```

## 3. Supported Extension Points

- **Relationship Providers**: Define how nodes connect to each other.
- **Visualization Modes**: Provide entirely new renderers (e.g., Matrix, 3D).
- **Layout Engines**: Provide algorithms for physical arrangement (e.g., Force, Dagre).
- **Toolbar Actions**: Add buttons to the global visualization toolbar.
- **Context Menu Actions**: Add right-click actions to nodes.
- **Node Actions**: Actions available on double click or hover menus.
- **Graph Overlays**: Floating UI layers over the visualization (e.g., Heatmaps, Search).
- **Node/Edge Renderers**: Custom SVG/React renderers for specific entity types.
- **Analytics Widgets**: Small cards that compute stats (e.g., Density, Degree).

## 4. Usage

To embed the visualization framework in a workspace:

```tsx
import { KnowledgeVisualization } from "@/plugins/lexforge/graph/components/KnowledgeVisualization";

export function GraphWorkspace() {
  return <KnowledgeVisualization initialNodeId="root-1" />;
}
```