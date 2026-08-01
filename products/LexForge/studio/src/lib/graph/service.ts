import { ExpandRequest, GraphView, LayoutEngine } from "./types";
import { GraphBuilder } from "./builder";
import { graphCache } from "./cache";
import { ForceLayout } from "./layout";

// Note: Ensure all providers are registered before service is used.
import "./providers/hunspell";
import "./providers/wordnet";
import "./providers/family";

export class GraphService {
  private static layouts: Map<string, LayoutEngine> = new Map([
    ["force", new ForceLayout()]
  ]);

  static async expandNode(request: ExpandRequest): Promise<GraphView> {
    // We can use a cache key that includes the node ID and requested relationships
    const relsKey = request.relationships ? [...request.relationships].sort().join(",") : "all";
    const cacheKey = `${request.id}-${request.depth}-${relsKey}`;

    let view = graphCache.get(cacheKey);

    if (!view) {
      view = await GraphBuilder.buildNeighborhood(request);
      
      // Default to force layout if none specified, or if we want to always layout new views
      const layoutEngine = this.layouts.get("force")!;
      view = layoutEngine.layout(view);

      graphCache.set(cacheKey, view);
    }

    return view;
  }
}
