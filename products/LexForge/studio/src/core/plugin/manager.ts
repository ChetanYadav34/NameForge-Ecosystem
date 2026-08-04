import { StudioPlugin, PluginNavigation } from "./types";
import { Icons } from "@/core/design/icons";

class PluginManager {
  private plugins = new Map<string, StudioPlugin>();

  public register(plugin: StudioPlugin) {
    if (this.plugins.has(plugin.manifest.id)) {
      console.warn(`[PluginManager] Plugin ${plugin.manifest.id} already registered.`);
      return;
    }
    this.plugins.set(plugin.manifest.id, plugin);
  }

  public getNavigation(): PluginNavigation[] {
    const nav: PluginNavigation[] = [];
    this.plugins.forEach(plugin => {
      if (plugin.manifest.navigation) {
        nav.push(...plugin.manifest.navigation);
      }
    });
    // Sort by order
    return nav.sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  public getAll(): StudioPlugin[] {
    return Array.from(this.plugins.values());
  }
}

export const corePlugins = new PluginManager();

// --- FOR NOW: Hardcode the LexForge plugin registration here to simulate ---
corePlugins.register({
  manifest: {
    id: "lexforge",
    name: "LexForge",
    version: "2.0.0",
    sdkVersion: "1.0.0",
    capabilities: {
      dataset: true,
      graph: true,
      validation: true,
    },
    navigation: [
      { id: "home", label: "Dashboard", icon: "Dashboard", route: "/", order: 1 },
      { id: "explorer", label: "Dataset Explorer", icon: "Dataset", route: "/explorer", order: 2 },
      { id: "graph", label: "Graph Explorer", icon: "Graph", route: "/graph", order: 3 },
      { id: "generation", label: "Generation", icon: "Compile", route: "/generation", order: 4 },
      { id: "validation", label: "Validation", icon: "Validation", route: "/validation", order: 5 },
      { id: "resources", label: "Resources", icon: "Resource", route: "/resources", order: 6 },
      { id: "settings", label: "Settings", icon: "Settings", route: "/settings", order: 99 },
    ]
  }
});
