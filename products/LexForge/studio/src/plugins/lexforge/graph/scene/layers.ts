import { SceneLayer } from "./types";

export const RenderLayers: Record<string, SceneLayer> = {
  BaseGraph: { id: "layer.base", name: "Base Graph", zIndex: 0, isVisible: true },
  Labels: { id: "layer.labels", name: "Labels", zIndex: 10, isVisible: true },
  Selection: { id: "layer.selection", name: "Selection", zIndex: 20, isVisible: true },
  SearchHighlights: { id: "layer.highlights", name: "Search Highlights", zIndex: 30, isVisible: true },
  Heatmaps: { id: "layer.heatmaps", name: "Heatmaps", zIndex: 5, isVisible: false },
  Debug: { id: "layer.debug", name: "Debug", zIndex: 100, isVisible: false },
  AIOverlay: { id: "layer.ai", name: "AI Overlay", zIndex: 50, isVisible: false }
};
