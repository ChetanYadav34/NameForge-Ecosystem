import { DiversificationStrategy, SimilarityAnalyzer } from "./types";

class DiversificationStrategyRegistry {
  private strategies: Map<string, DiversificationStrategy> = new Map();

  register(strategy: DiversificationStrategy): void {
    if (this.strategies.has(strategy.id)) {
      throw new Error(`DiversificationStrategy with ID ${strategy.id} is already registered.`);
    }
    this.strategies.set(strategy.id, strategy);
  }

  get(id: string): DiversificationStrategy | undefined {
    return this.strategies.get(id);
  }

  getAll(): DiversificationStrategy[] {
    return Array.from(this.strategies.values());
  }

  clear(): void {
    this.strategies.clear();
  }
}

class SimilarityAnalyzerRegistry {
  private analyzers: Map<string, SimilarityAnalyzer> = new Map();

  register(analyzer: SimilarityAnalyzer): void {
    if (this.analyzers.has(analyzer.id)) {
      throw new Error(`SimilarityAnalyzer with ID ${analyzer.id} is already registered.`);
    }
    this.analyzers.set(analyzer.id, analyzer);
  }

  get(id: string): SimilarityAnalyzer | undefined {
    return this.analyzers.get(id);
  }

  getAll(): SimilarityAnalyzer[] {
    return Array.from(this.analyzers.values());
  }

  clear(): void {
    this.analyzers.clear();
  }
}

export const diversificationStrategyRegistry = new DiversificationStrategyRegistry();
export const similarityAnalyzerRegistry = new SimilarityAnalyzerRegistry();
