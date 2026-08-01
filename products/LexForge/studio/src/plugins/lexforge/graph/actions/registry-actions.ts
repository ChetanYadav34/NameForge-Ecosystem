import { graphRegistry } from "../registry";

graphRegistry.registerToolbarAction({
  id: "action.fitView",
  icon: "Maximize",
  label: "Fit View",
  execute: (context) => {
    // Dispatch FitView command
  },
  group: "view"
});

graphRegistry.registerToolbarAction({
  id: "action.undo",
  icon: "Undo",
  label: "Undo",
  execute: (context) => {
    // Undo
  },
  group: "history"
});

graphRegistry.registerToolbarAction({
  id: "action.redo",
  icon: "Redo",
  label: "Redo",
  execute: (context) => {
    // Redo
  },
  group: "history"
});

graphRegistry.registerToolbarAction({
  id: "action.export",
  icon: "Download",
  label: "Export Image",
  execute: (context) => {
    // Export
  },
  group: "data"
});
