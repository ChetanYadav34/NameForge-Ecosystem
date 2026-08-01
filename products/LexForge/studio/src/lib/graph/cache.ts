import { GraphView } from "./types";

class GraphCache {
  private cache = new Map<string, { view: GraphView; timestamp: number }>();
  private readonly MAX_SIZE = 100;
  private readonly TTL = 1000 * 60 * 60; // 1 hour

  get(nodeId: string): GraphView | null {
    const entry = this.cache.get(nodeId);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(nodeId);
      return null;
    }
    
    return entry.view;
  }

  set(nodeId: string, view: GraphView) {
    if (this.cache.size >= this.MAX_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(nodeId, {
      view,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

export const graphCache = new GraphCache();
