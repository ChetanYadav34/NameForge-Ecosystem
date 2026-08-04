import { create } from "zustand";
import { GraphView, GraphNode, GraphEdge, RelationshipDefinition } from "@/lib/graph/types";
import { expandNodeAction } from "@/app/actions/graph";
import { SceneData } from "@/plugins/lexforge/graph/scene/types";
import { getRelationshipDefinitions } from "@/lib/graph/providers/registry";

interface GraphState {
  view: GraphView;
  selectedNodeId: string | null;
  expandedNodeIds: Set<string>;
  searchQuery: string;
  loading: boolean;
  relationshipFilters: Set<string>; // IDs of active relationships
  sceneData: SceneData | null; // For diagnostics
  
  // Actions
  setSearchQuery: (query: string) => void;
  selectNode: (id: string | null) => void;
  expandNode: (id: string) => Promise<void>;
  collapseNode: (id: string) => void;
  toggleRelationship: (relId: string) => void;
  setSceneData: (sceneData: SceneData) => void;
  resetView: () => void;
  initFilters: () => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  view: { nodes: [], edges: [], statistics: { nodeCount: 0, edgeCount: 0, connectedComponents: 0, averageDegree: 0, generatedAt: "" } },
  selectedNodeId: null,
  expandedNodeIds: new Set(),
  searchQuery: "",
  loading: false,
  relationshipFilters: new Set(),
  sceneData: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  selectNode: (id) => set({ selectedNodeId: id }),
  setSceneData: (sceneData) => set({ sceneData }),

  initFilters: () => {
    // If we're on the client, we might not have access to the server-side registry directly like this.
    // However, since Next.js can bundle this, we can try to extract definitions.
    // A better approach is to expose a server action or API for definitions.
    // For now, we will assume this works or pass it from a Server Component.
  },

  expandNode: async (id) => {
    set({ loading: true });
    try {
      const activeFilters = Array.from(get().relationshipFilters);
      const res = await expandNodeAction({
        id,
        depth: 1,
        relationships: activeFilters.length > 0 ? activeFilters : undefined
      });

      if (res.success && res.view) {
        set((state) => {
          // Merge views
          const nodeMap = new Map(state.view.nodes.map(n => [n.id, n]));
          res.view!.nodes.forEach((n: GraphNode) => {
            if (!nodeMap.has(n.id)) {
              nodeMap.set(n.id, n);
            }
          });

          const edgeMap = new Map(state.view.edges.map(e => [e.id, e]));
          res.view!.edges.forEach((e: GraphEdge) => {
            // Check if edge between source/target/relationship exists
            const exists = Array.from(edgeMap.values()).some(
              existing => existing.source === e.source && existing.target === e.target && existing.relationship === e.relationship
            );
            if (!exists) edgeMap.set(e.id, e);
          });

          const newExpanded = new Set(state.expandedNodeIds);
          newExpanded.add(id);

          return {
            view: {
              nodes: Array.from(nodeMap.values()),
              edges: Array.from(edgeMap.values()),
              statistics: res.view!.statistics // update to latest stats, or calculate merged stats
            },
            expandedNodeIds: newExpanded,
            loading: false
          };
        });
      } else {
        set({ loading: false });
        console.error(res.error);
      }
    } catch (e) {
      set({ loading: false });
      console.error(e);
    }
  },

  collapseNode: (id) => {
    // Advanced: To collapse a node, we'd remove nodes that are only connected to this node.
    // For now, we just unmark it as expanded.
    set((state) => {
      const newExpanded = new Set(state.expandedNodeIds);
      newExpanded.delete(id);
      return { expandedNodeIds: newExpanded };
    });
  },

  toggleRelationship: (relId) => {
    set((state) => {
      const newFilters = new Set(state.relationshipFilters);
      if (newFilters.has(relId)) {
        newFilters.delete(relId);
      } else {
        newFilters.add(relId);
      }
      return { relationshipFilters: newFilters };
    });
  },

  resetView: () => {
    set({
      view: { nodes: [], edges: [], statistics: { nodeCount: 0, edgeCount: 0, connectedComponents: 0, averageDegree: 0, generatedAt: "" } },
      selectedNodeId: null,
      expandedNodeIds: new Set(),
      searchQuery: "",
      sceneData: null
    });
  }
}));
