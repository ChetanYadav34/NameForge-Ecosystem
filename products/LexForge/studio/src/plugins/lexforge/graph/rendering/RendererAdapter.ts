import { SceneData, SceneCamera, SceneSelection } from "../scene/types";
import { GraphOverlay } from "../registry/types";

export interface IRendererAdapter {
  id: string;
  name: string;
  
  // Lifecycle
  mount(container: HTMLElement): void;
  unmount(): void;
  
  // Data ingestion
  render(data: SceneData): void;
  
  // Interactions
  setCamera(camera: SceneCamera): void;
  setSelection(selection: SceneSelection): void;
  
  // Overlays
  addOverlay(overlay: GraphOverlay): void;
  removeOverlay(overlayId: string): void;
}
