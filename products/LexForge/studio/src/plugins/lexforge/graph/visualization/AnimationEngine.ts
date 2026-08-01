import { SceneCamera, SceneViewport, SceneNode } from "../scene/types";

export class AnimationEngine {
  public animateCamera(camera: SceneCamera, target: SceneViewport, durationMs: number): void {
    // Easing functions and requestAnimationFrame loops belong here
    // rather than inside React Flow
    camera.viewport = target; // mock
  }

  public animateNode(node: SceneNode, targetX: number, targetY: number, durationMs: number): void {
    node.x = targetX;
    node.y = targetY;
  }
  
  public highlightNode(node: SceneNode): void {
    // animate opacity/scale
  }
}
