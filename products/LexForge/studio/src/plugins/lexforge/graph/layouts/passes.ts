import { SceneNode, SceneEdge } from "../scene/types";
import { LayoutContext, ILayoutPass } from "./LayoutPipeline";

export class PreLayoutPass implements ILayoutPass {
  async execute(nodes: SceneNode[], edges: SceneEdge[], context: LayoutContext) {
    return { nodes, edges };
  }
}

export class ConstraintPass implements ILayoutPass {
  async execute(nodes: SceneNode[], edges: SceneEdge[], context: LayoutContext) {
    return { nodes, edges };
  }
}

export class PhysicsPass implements ILayoutPass {
  async execute(nodes: SceneNode[], edges: SceneEdge[], context: LayoutContext) {
    return { nodes, edges };
  }
}

export class CollisionPass implements ILayoutPass {
  async execute(nodes: SceneNode[], edges: SceneEdge[], context: LayoutContext) {
    return { nodes, edges };
  }
}

export class ViewportFitPass implements ILayoutPass {
  async execute(nodes: SceneNode[], edges: SceneEdge[], context: LayoutContext) {
    return { nodes, edges };
  }
}
