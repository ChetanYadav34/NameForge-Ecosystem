import { SceneNode, SceneEdge, SceneViewport } from "../scene/types";
import { LayoutEngine } from "../registry/types";

export interface LayoutContext {
  viewport: SceneViewport;
  options?: any;
}

export interface ILayoutPass {
  execute(nodes: SceneNode[], edges: SceneEdge[], context: LayoutContext): Promise<{ nodes: SceneNode[], edges: SceneEdge[] }>;
}

export class LayoutPipeline {
  private passes: ILayoutPass[] = [];

  public addPass(pass: ILayoutPass): void {
    this.passes.push(pass);
  }

  public async execute(nodes: SceneNode[], edges: SceneEdge[], context: LayoutContext): Promise<{ nodes: SceneNode[], edges: SceneEdge[] }> {
    let currentNodes = [...nodes];
    let currentEdges = [...edges];
    
    for (const pass of this.passes) {
      const result = await pass.execute(currentNodes, currentEdges, context);
      currentNodes = result.nodes;
      currentEdges = result.edges;
    }
    
    return { nodes: currentNodes, edges: currentEdges };
  }
}
