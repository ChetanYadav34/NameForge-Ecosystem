import { GraphOverlay } from "../registry/types";

export class HeatmapOverlay implements GraphOverlay {
  id = "overlay.heatmap";
  name = "Frequency Heatmap";
  render(context: any) {
    return null; // React rendering logic
  }
}

export class WordFamilyOverlay implements GraphOverlay {
  id = "overlay.wordFamily";
  name = "Word Family";
  render(context: any) {
    return null;
  }
}

export class SearchOverlay implements GraphOverlay {
  id = "overlay.search";
  name = "Search Results";
  render(context: any) {
    return null;
  }
}

export class ClusterOverlay implements GraphOverlay {
  id = "overlay.cluster";
  name = "Cluster Hulls";
  render(context: any) {
    return null;
  }
}

export class DebugOverlay implements GraphOverlay {
  id = "overlay.debug";
  name = "Debug Info";
  render(context: any) {
    return null;
  }
}
