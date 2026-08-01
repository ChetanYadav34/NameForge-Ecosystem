import { SceneCamera, SceneViewport, SceneBounds } from "./types";

export class CameraSystem implements SceneCamera {
  public viewport: SceneViewport = { x: 0, y: 0, zoom: 1, bounds: { x: 0, y: 0, width: 800, height: 600 } };
  
  public pan(dx: number, dy: number): void {
    this.viewport.x += dx;
    this.viewport.y += dy;
  }
  
  public zoom(factor: number): void {
    this.viewport.zoom *= factor;
  }
  
  public focus(bounds: SceneBounds): void {
    // Math to center the camera on the bounds
  }
  
  public fit(): void {
    // Fit to entire scene bounds
  }
  
  public animate(targetViewport: SceneViewport, durationMs: number): void {
    // Stub for AnimationEngine to take over
    this.viewport = targetViewport;
  }
}
