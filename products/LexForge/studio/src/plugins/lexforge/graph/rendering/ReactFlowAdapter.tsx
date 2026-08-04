import { useCallback, useMemo, useEffect } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, NodeProps, EdgeProps, Handle, Position, Node, Edge, useReactFlow, useNodesState, useEdgesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { SceneData, SceneNode, SceneEdge } from "../scene/types";
import { graphRegistry } from "../registry";
import { commandManager } from "../actions";

import { NodeChange } from "@xyflow/react";

interface ReactFlowAdapterProps {
  scene: SceneData;
  focusNodeId?: string | null;
  onNodeClick?: (id: string) => void;
  onNodeDoubleClick?: (id: string) => void;
  onNodeContextMenu?: (event: React.MouseEvent, id: string) => void;
  onNodesChange?: (changes: NodeChange<Node>[]) => void;
}

export function ReactFlowAdapter({ scene, focusNodeId, onNodeClick, onNodeDoubleClick, onNodeContextMenu, onNodesChange }: ReactFlowAdapterProps) {
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

  const { fitView } = useReactFlow();
  
  const [nodes, setNodes, onNodesChangeInner] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChangeInner] = useEdgesState<Edge>([]);

  // Sync SceneData to ReactFlow State
  useEffect(() => {
    // Preserve existing coordinates for nodes that are pinned or already positioned manually
    setNodes((currentNodes) => {
      const currentPosMap = new Map(currentNodes.map(n => [n.id, n.position]));
      
      return scene.nodes.map(sn => {
        const isPinned = !!sn.data?.metadata?.isPinned;
        const currentPos = currentPosMap.get(sn.id);
        
        // If node is pinned, ALWAYS use the current position from React Flow if it exists.
        // Otherwise, use scene position (which came from random or layout engine)
        const pos = (isPinned && currentPos) ? currentPos : { x: sn.x, y: sn.y };
        
        return {
          id: sn.id,
          type: graphRegistry.nodeRenderers.has(sn.data?.type) ? sn.data.type : "default",
          position: pos,
          data: { sceneNode: sn },
          hidden: !sn.isVisible,
          draggable: !isPinned, // Disable dragging for pinned nodes
          style: { opacity: sn.opacity, zIndex: sn.zIndex }
        };
      });
    });

    setEdges(scene.edges.map(se => ({
      id: se.id,
      source: se.source,
      target: se.target,
      type: graphRegistry.edgeRenderers.has(se.data?.type) ? se.data.type : "default",
      data: { sceneEdge: se },
      hidden: !se.isVisible,
      style: { opacity: se.opacity, zIndex: se.zIndex }
    })));
  }, [scene, setNodes, setEdges]);

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

  useEffect(() => {
    // Dynamically import coreEvents to avoid server-side issues
    let unsubscribeFit: () => void;
    let unsubscribeFocus: () => void;
    
    import("@/core/event/bus").then(({ coreEvents }) => {
      import("@/core/event/types").then(({ EventType }) => {
        unsubscribeFit = coreEvents.subscribe(EventType.CameraFit, () => {
          fitView({ padding: 0.2, duration: 800 });
        });
        
        unsubscribeFocus = coreEvents.subscribe(EventType.CameraFocus, (event) => {
          const payload = event.payload;
          if (payload?.nodeId) {
            fitView({ nodes: [{ id: payload.nodeId }], padding: 0.5, duration: 800, maxZoom: 1.5 });
          }
        });
      });
    });

    return () => {
      if (unsubscribeFit) unsubscribeFit();
      if (unsubscribeFocus) unsubscribeFocus();
    };
  }, [fitView]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={(changes) => {
          onNodesChangeInner(changes);
          if (onNodesChange) onNodesChange(changes);
        }}
        onEdgesChange={onEdgesChangeInner}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodeContextMenu={handleNodeContextMenu}
        nodesDraggable={true}
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
