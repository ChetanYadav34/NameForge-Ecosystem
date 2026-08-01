import { GraphCommandManager } from "./GraphCommandManager";
import { ExpandNodeCommand, CollapseNodeCommand, PinNodeCommand } from "./commands";

export const commandManager = new GraphCommandManager();

commandManager.register(new ExpandNodeCommand());
commandManager.register(new CollapseNodeCommand());
commandManager.register(new PinNodeCommand());

export * from "./types";
