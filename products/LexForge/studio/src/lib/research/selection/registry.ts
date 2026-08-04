import { SelectionStrategy } from "./types";

class SelectionStrategyRegistry {
  private strategies: Map<string, SelectionStrategy> = new Map();

  register(strategy: SelectionStrategy): void {
    if (this.strategies.has(strategy.id)) {
      throw new Error(`SelectionStrategy with ID ${strategy.id} is already registered.`);
    }
    this.strategies.set(strategy.id, strategy);
  }

  get(id: string): SelectionStrategy | undefined {
    return this.strategies.get(id);
  }

  getAll(): SelectionStrategy[] {
    return Array.from(this.strategies.values());
  }

  clear(): void {
    this.strategies.clear();
  }
}

export const selectionStrategyRegistry = new SelectionStrategyRegistry();
