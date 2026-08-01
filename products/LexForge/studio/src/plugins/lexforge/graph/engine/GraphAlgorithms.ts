import { GraphData } from "../types/graph";

export interface IGraphAlgorithm {
  execute(data: GraphData): any;
}

export class GraphAlgorithms {
  private algorithms = new Map<string, IGraphAlgorithm>();

  public register(id: string, algo: IGraphAlgorithm) {
    this.algorithms.set(id, algo);
  }

  public execute(id: string, data: GraphData): any {
    const algo = this.algorithms.get(id);
    if (!algo) {
      throw new Error(`Algorithm ${id} not found`);
    }
    return algo.execute(data);
  }
}
