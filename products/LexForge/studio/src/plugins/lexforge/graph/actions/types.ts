export interface GraphCommandContext {
  sessionId: string;
  // references to subsystems would be passed here or resolved via service registry
}

export interface GraphCommand {
  id: string;
  execute(context: GraphCommandContext, args?: any): Promise<void>;
  undo?(context: GraphCommandContext, args?: any): Promise<void>;
}
