import { GraphData } from "../types/graph";

export class GraphSerialization {
  public serialize(data: GraphData): string {
    return JSON.stringify(data);
  }

  public deserialize(serialized: string): GraphData {
    return JSON.parse(serialized);
  }
}
