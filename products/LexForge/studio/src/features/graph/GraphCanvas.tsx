"use client";

import { useMemo, useEffect, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { useGraphStore } from "@/store/useGraphStore";
import { useExplorerStore } from "@/store/useExplorerStore";
import { ReactFlowAdapter } from "@/plugins/lexforge/graph/rendering/ReactFlowAdapter";
import { VisualizationRuntime } from "@/plugins/lexforge/graph/visualization/VisualizationRuntime";
import { SceneData } from "@/plugins/lexforge/graph/scene/types";
import { commandManager } from "@/plugins/lexforge/graph/actions";
import { graphRegistry } from "@/plugins/lexforge/graph/registry";
import { useGraphSessionStore } from "@/plugins/lexforge/graph/history/session";

// Shared runtime instance for the tab
const runtime = new VisualizationRuntime();

export function GraphCanvas() {
  const { view, loading, selectedNodeId, selectNode, expandNode, relationshipFilters, expandedNodeIds } = useGraphStore();
  const { selectWord } = useExplorerStore();
  
  const [sceneData, setSceneData] = useState<SceneData>({ nodes: [], edges: [] });

  const { activeLayout } = useGraphSessionStore();

  useEffect(() => {
    if (view.nodes.length === 0 && !loading) {
      // Load a default node if the graph is empty
      expandNode("fire");
      selectNode("fire");
    }
  }, [view.nodes.length, loading, expandNode, selectNode]);

  useEffect(() => {
    const processScene = async () => {
      const { pinnedNodes, activeLayout } = useGraphSessionStore.getState();
      
      const mappedView = {
        nodes: view.nodes.map(n => ({ ...n, metadata: n.metadata || {} })),
        edges: view.edges
          .filter(e => relationshipFilters.size === 0 || relationshipFilters.has(e.relationship))
          .map(e => ({ ...e, type: e.relationship, metadata: {} }))
      };
      
      let scene = runtime.convert(mappedView);
      
      // 2. Apply active visualization mode
      // let mode = graphRegistry.visualizationModes.get(activeModeId);

      // 3. Apply active layout
      const layoutEngine = graphRegistry.layoutEngines.get(activeLayout);
      if (layoutEngine) {
        scene = await runtime.applyLayout(scene, layoutEngine);
      }

      // 4. Apply hierarchy sizes and labels
      const rootNodes = expandedNodeIds.size > 0 ? Array.from(expandedNodeIds) : (scene.nodes.length > 0 ? [scene.nodes[0].id] : []);
      scene = runtime.applyHierarchy(scene, rootNodes, pinnedNodes);

      // 5. Apply selection decoration
      if (selectedNodeId) {
        scene.nodes = scene.nodes.map(n => 
          n.id === selectedNodeId ? { ...n, layerId: "selection" } : n
        );
      }
      
      setSceneData(scene);
      useGraphStore.getState().setSceneData(scene);
    };

    processScene();
  }, [view, selectedNodeId, activeLayout, relationshipFilters]);

  const handleNodeClick = (id: string) => {
    selectNode(id);
    const node = view.nodes.find(n => n.id === id);
    if (node && node.type === 'word') {
      selectWord(parseInt(id, 10));
    }
  };

  const handleNodeDoubleClick = (id: string) => {
    commandManager.execute("graph.expandNode", { sessionId: "default" }, { nodeId: id });
  };

  const handleNodeContextMenu = (event: React.MouseEvent, id: string) => {
    // Custom context menu logic would go here
  };

  return (
    <div className="w-full h-full bg-[#0B0B0D]">
      <ReactFlowProvider>
        <ReactFlowAdapter 
          scene={sceneData} 
          focusNodeId={selectedNodeId}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          onNodeContextMenu={handleNodeContextMenu}
        />
      </ReactFlowProvider>
    </div>
  );
}
