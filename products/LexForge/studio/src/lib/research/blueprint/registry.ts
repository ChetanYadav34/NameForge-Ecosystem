import { BlueprintAnalyzer } from "./types";

class BlueprintAnalyzerRegistry {
  private analyzers: Map<string, BlueprintAnalyzer> = new Map();

  register(analyzer: BlueprintAnalyzer): void {
    if (this.analyzers.has(analyzer.id)) {
      throw new Error(`Analyzer with ID ${analyzer.id} is already registered.`);
    }
    this.analyzers.set(analyzer.id, analyzer);
  }

  get(id: string): BlueprintAnalyzer | undefined {
    return this.analyzers.get(id);
  }

  getAll(): BlueprintAnalyzer[] {
    return Array.from(this.analyzers.values());
  }

  clear(): void {
    this.analyzers.clear();
  }
}

export const blueprintAnalyzerRegistry = new BlueprintAnalyzerRegistry();
