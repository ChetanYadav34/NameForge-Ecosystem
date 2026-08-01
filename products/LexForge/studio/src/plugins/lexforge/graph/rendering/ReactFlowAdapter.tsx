import { useCallback, useMemo, useEffect } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, NodeProps, EdgeProps, Handle, Position, Node, Edge, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { SceneData, SceneNode, SceneEdge } from "../scene/types";
import { graphRegistry } from "../registry";
import { commandManager } from "../actions";

interface ReactFlowAdapterProps {
  scene: SceneData;
  focusNodeId?: string | null;
  onNodeClick?: (id: string) => void;
  onNodeDoubleClick?: (id: string) => void;
  onNodeContextMenu?: (event: React.MouseEvent, id: string) => void;
}

export function ReactFlowAdapter({ scene, focusNodeId, onNodeClick, onNodeDoubleClick, onNodeContextMenu }: ReactFlowAdapterProps) {
  // Convert registries to React Flow maps
  const nodeTypes = useMemo(() => {
    const types: Record<string, any> = {};
    for (const [key, renderer] of graphRegistry.nodeRenderers.entries()) {
      types[key] = renderer.component;
    }
    return types;
  }, []);

  const edgeTypes = useMemo(() => {
    const types: Record<string, any> = {};
    for (const [key, renderer] of graphRegistry.edgeRenderers.entries()) {
      types[key] = renderer.component;
    }
    return types;
  }, []);

  // Convert Scene to React Flow
  const nodes: Node[] = useMemo(() => {
    return scene.nodes.map(sn => ({
      id: sn.id,
      type: graphRegistry.nodeRenderers.has(sn.data?.type) ? sn.data.type : "default",
      position: { x: sn.x, y: sn.y },
      data: { sceneNode: sn },
      hidden: !sn.isVisible,
      style: { opacity: sn.opacity, zIndex: sn.zIndex }
    }));
  }, [scene.nodes]);

  const edges: Edge[] = useMemo(() => {
    return scene.edges.map(se => ({
      id: se.id,
      source: se.source,
      target: se.target,
      type: graphRegistry.edgeRenderers.has(se.data?.type) ? se.data.type : "default",
      data: { sceneEdge: se },
      hidden: !se.isVisible,
      style: { opacity: se.opacity, zIndex: se.zIndex }
    }));
  }, [scene.edges]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (onNodeClick) onNodeClick(node.id);
  }, [onNodeClick]);

  const handleNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (onNodeDoubleClick) onNodeDoubleClick(node.id);
  }, [onNodeDoubleClick]);

  const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    if (onNodeContextMenu) onNodeContextMenu(event, node.id);
  }, [onNodeContextMenu]);

  const { fitView } = useReactFlow();

  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        if (focusNodeId) {
          fitView({ nodes: [{ id: focusNodeId }], padding: 0.5, duration: 800, maxZoom: 1.5 });
        } else {
          fitView({ padding: 0.2, duration: 800 });
        }
      }, 50); // slight delay to ensure nodes are rendered
    }
  }, [nodes.length, fitView, focusNodeId]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodeContextMenu={handleNodeContextMenu}
        nodesDraggable={true} // React flow handles drag, but Scene Graph should be updated in real impl
        nodesConnectable={false}
        elementsSelectable={true}
        colorMode="dark"
        minZoom={0.1}
        maxZoom={4}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#27272C" />
        <Controls className="bg-surface-elevated border-border fill-foreground" />
        <MiniMap 
          nodeColor={(n) => {
            const sn = n.data?.sceneNode as SceneNode;
            return sn?.layerId === "selection" ? "#D4AF37" : "#27272C";
          }}
          maskColor="rgba(0,0,0,0.5)"
          className="bg-surface-elevated border border-border rounded-md shadow-md"
        />
      </ReactFlow>
    </div>
  );
}
