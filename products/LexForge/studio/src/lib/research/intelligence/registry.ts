import { IntelligenceAnalyzer } from "./types";

class IntelligenceAnalyzerRegistry {
  private analyzers: Map<string, IntelligenceAnalyzer> = new Map();

  register(analyzer: IntelligenceAnalyzer): void {
    if (this.analyzers.has(analyzer.id)) {
      throw new Error(`Analyzer with ID ${analyzer.id} is already registered.`);
    }
    this.analyzers.set(analyzer.id, analyzer);
  }

  get(id: string): IntelligenceAnalyzer | undefined {
    return this.analyzers.get(id);
  }

  getAll(): IntelligenceAnalyzer[] {
    return Array.from(this.analyzers.values());
  }

  clear(): void {
    this.analyzers.clear();
  }
}

export const intelligenceAnalyzerRegistry = new IntelligenceAnalyzerRegistry();
