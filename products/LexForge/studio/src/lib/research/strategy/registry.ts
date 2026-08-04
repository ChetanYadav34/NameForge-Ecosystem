import { GenerationStrategy } from "./types";

class GenerationStrategyRegistry {
  private strategies: Map<string, GenerationStrategy> = new Map();

  register(strategy: GenerationStrategy): void {
    if (this.strategies.has(strategy.id)) {
      throw new Error(`Strategy with ID ${strategy.id} is already registered.`);
    }
    this.strategies.set(strategy.id, strategy);
  }

  get(id: string): GenerationStrategy | undefined {
    return this.strategies.get(id);
  }

  getByDomain(domain: string): GenerationStrategy | undefined {
    return Array.from(this.strategies.values()).find(s => s.domain === domain);
  }

  getAll(): GenerationStrategy[] {
    return Array.from(this.strategies.values());
  }

  clear(): void {
    this.strategies.clear();
  }
}

export const strategyRegistry = new GenerationStrategyRegistry();
