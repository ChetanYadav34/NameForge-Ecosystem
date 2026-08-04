import { RankingStrategy } from "./types";

class RankingStrategyRegistry {
  private strategies: Map<string, RankingStrategy> = new Map();

  register(strategy: RankingStrategy): void {
    if (this.strategies.has(strategy.id)) {
      throw new Error(`RankingStrategy with ID ${strategy.id} is already registered.`);
    }
    this.strategies.set(strategy.id, strategy);
  }

  get(id: string): RankingStrategy | undefined {
    return this.strategies.get(id);
  }

  getAll(): RankingStrategy[] {
    return Array.from(this.strategies.values());
  }

  clear(): void {
    this.strategies.clear();
  }
}

export const rankingStrategyRegistry = new RankingStrategyRegistry();
