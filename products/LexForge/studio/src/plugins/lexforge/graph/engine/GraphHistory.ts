import { GraphData } from "../types/graph";

export class GraphHistory {
  private history: GraphData[] = [];
  private cursor = -1;

  public push(data: GraphData): void {
    // Truncate future history if we branched
    if (this.cursor < this.history.length - 1) {
      this.history = this.history.slice(0, this.cursor + 1);
    }
    this.history.push(JSON.parse(JSON.stringify(data))); // deep copy
    this.cursor++;
  }

  public undo(): GraphData | null {
    if (this.cursor > 0) {
      this.cursor--;
      return JSON.parse(JSON.stringify(this.history[this.cursor]));
    }
    return null;
  }

  public redo(): GraphData | null {
    if (this.cursor < this.history.length - 1) {
      this.cursor++;
      return JSON.parse(JSON.stringify(this.history[this.cursor]));
    }
    return null;
  }
}
