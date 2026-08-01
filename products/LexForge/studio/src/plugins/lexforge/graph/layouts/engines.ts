import { LayoutEngine } from "../registry/types";
import { SceneNode, SceneEdge } from "../scene/types";
import { LayoutPipeline } from "./LayoutPipeline";
import { PreLayoutPass, PhysicsPass, CollisionPass, ViewportFitPass, ConstraintPass } from "./passes";

export class ForceDirectedLayout implements LayoutEngine {
  id = "layout.force-directed";
  name = "Force Directed";
  
  async applyLayout(nodes: SceneNode[], edges: SceneEdge[], options?: any) {
    const pipeline = new LayoutPipeline();
    pipeline.addPass(new PreLayoutPass());
    pipeline.addPass(new PhysicsPass());
    pipeline.addPass(new CollisionPass());
    pipeline.addPass(new ViewportFitPass());
    
    // We would pass the viewport in context, mock for now
    const context = { viewport: { x: 0, y: 0, zoom: 1, bounds: { x: 0, y: 0, width: 800, height: 600 } }, options };
    return pipeline.execute(nodes, edges, context);
  }
}

export class HierarchicalLayout implements LayoutEngine {
  id = "layout.hierarchical";
  name = "Hierarchical";
  
  async applyLayout(nodes: SceneNode[], edges: SceneEdge[], options?: any) {
    const pipeline = new LayoutPipeline();
    pipeline.addPass(new PreLayoutPass());
    pipeline.addPass(new ConstraintPass());
    pipeline.addPass(new ViewportFitPass());
    
    const context = { viewport: { x: 0, y: 0, zoom: 1, bounds: { x: 0, y: 0, width: 800, height: 600 } }, options };
    return pipeline.execute(nodes, edges, context);
  }
}

export class RadialLayout implements LayoutEngine {
  id = "layout.radial";
  name = "Radial";
  
  async applyLayout(nodes: SceneNode[], edges: SceneEdge[], options?: any) {
    const pipeline = new LayoutPipeline();
    pipeline.addPass(new PreLayoutPass());
    pipeline.addPass(new ConstraintPass());
    pipeline.addPass(new ViewportFitPass());
    
    const context = { viewport: { x: 0, y: 0, zoom: 1, bounds: { x: 0, y: 0, width: 800, height: 600 } }, options };
    return pipeline.execute(nodes, edges, context);
  }
}

export class TreeLayout implements LayoutEngine {
  id = "layout.tree";
  name = "Tree";
  
  async applyLayout(nodes: SceneNode[], edges: SceneEdge[], options?: any) {
    const pipeline = new LayoutPipeline();
    pipeline.addPass(new PreLayoutPass());
    pipeline.addPass(new ConstraintPass());
    pipeline.addPass(new ViewportFitPass());
    
    const context = { viewport: { x: 0, y: 0, zoom: 1, bounds: { x: 0, y: 0, width: 800, height: 600 } }, options };
    return pipeline.execute(nodes, edges, context);
  }
}
