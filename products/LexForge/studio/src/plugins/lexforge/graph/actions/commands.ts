import { GraphCommand, GraphCommandContext } from "./types";
import { useGraphSessionStore } from "../history/session";

import { useGraphStore } from "@/store/useGraphStore";

export class ExpandNodeCommand implements GraphCommand {
  id = "graph.expandNode";
  
  async execute(context: GraphCommandContext, args: { nodeId: string }): Promise<void> {
    const { expandNode } = useGraphStore.getState();
    await expandNode(args.nodeId);
    
    // Also track in session store
    const { expandedNodes, setExpandedNodes } = useGraphSessionStore.getState();
    if (!expandedNodes.includes(args.nodeId)) {
      setExpandedNodes([...expandedNodes, args.nodeId]);
    }
  }
}

export class CollapseNodeCommand implements GraphCommand {
  id = "graph.collapseNode";
  
  async execute(context: GraphCommandContext, args: { nodeId: string }): Promise<void> {
    const { expandedNodes, setExpandedNodes } = useGraphSessionStore.getState();
    setExpandedNodes(expandedNodes.filter(id => id !== args.nodeId));
  }
}

export class PinNodeCommand implements GraphCommand {
  id = "graph.pinNode";
  
  async execute(context: GraphCommandContext, args: { nodeId: string }): Promise<void> {
    const { pinnedNodes, setPinnedNodes } = useGraphSessionStore.getState();
    if (!pinnedNodes.includes(args.nodeId)) {
      setPinnedNodes([...pinnedNodes, args.nodeId]);
    } else {
      setPinnedNodes(pinnedNodes.filter(id => id !== args.nodeId));
    }
  }
}

import { EventType } from "@/core/event/types";

export class FitViewCommand implements GraphCommand {
  id = "graph.camera.fit";
  description = "Fit camera to see entire graph";
  
  async execute(): Promise<void> {
    const { coreEvents } = await import("@/core/event/bus");
    coreEvents.publish(EventType.CameraFit, null);
  }
}

export class FocusNodeCommand implements GraphCommand {
  id = "graph.camera.focus";
  description = "Focus camera on specific node";
  
  async execute(context: GraphCommandContext, args: Record<string, any>): Promise<void> {
    if (!args.nodeId) throw new Error("FocusNodeCommand requires nodeId");
    const { coreEvents } = await import("@/core/event/bus");
    coreEvents.publish(EventType.CameraFocus, { nodeId: args.nodeId });
  }
}
