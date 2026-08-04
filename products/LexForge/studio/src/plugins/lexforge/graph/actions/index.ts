import { GraphCommandManager } from "./GraphCommandManager";
import { ExpandNodeCommand, CollapseNodeCommand, PinNodeCommand, FitViewCommand, FocusNodeCommand } from "./commands";

export const commandManager = new GraphCommandManager();

commandManager.register(new ExpandNodeCommand());
commandManager.register(new CollapseNodeCommand());
commandManager.register(new PinNodeCommand());
commandManager.register(new FitViewCommand());
commandManager.register(new FocusNodeCommand());

export * from "./types";
