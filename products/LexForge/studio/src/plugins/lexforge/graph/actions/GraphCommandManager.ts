import { GraphCommand, GraphCommandContext } from "./types";

export class GraphCommandManager {
  private commands = new Map<string, GraphCommand>();
  private history: { commandId: string; args: any }[] = [];

  public register(command: GraphCommand): void {
    this.commands.set(command.id, command);
  }

  public async execute(id: string, context: GraphCommandContext, args?: any): Promise<void> {
    const command = this.commands.get(id);
    if (!command) {
      throw new Error(`Command ${id} not found`);
    }

    await command.execute(context, args);
    this.history.push({ commandId: id, args });
  }
}
