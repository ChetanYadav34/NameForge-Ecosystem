import { DiscoveryProvider, FeatureExtractor, ResearchPass, ConfidenceRule } from "./types";

class Registry<T extends { id: string; priority?: number }> {
  private items: Map<string, T> = new Map();

  register(item: T): void {
    if (this.items.has(item.id)) {
      console.warn(`Registry warning: Overwriting item with id ${item.id}`);
    }
    this.items.set(item.id, item);
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  getAll(): T[] {
    const arr = Array.from(this.items.values());
    
    // Sort by priority if applicable (lower numbers run first)
    if (arr.length > 0 && "priority" in arr[0]) {
      arr.sort((a, b) => ((a.priority as number) || 0) - ((b.priority as number) || 0));
    }
    
    return arr;
  }
}

export const discoveryProviderRegistry = new Registry<DiscoveryProvider>();
export const researchPassRegistry = new Registry<ResearchPass>();
export const featureExtractorRegistry = new Registry<FeatureExtractor<any>>();
export const confidenceRuleRegistry = new Registry<ConfidenceRule>();
