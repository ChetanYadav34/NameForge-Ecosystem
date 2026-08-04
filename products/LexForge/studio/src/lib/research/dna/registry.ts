import { DNAAnalyzer } from "./types";

class DNAAnalyzerRegistry {
  private analyzers: Map<string, DNAAnalyzer<any>> = new Map();

  register(analyzer: DNAAnalyzer<any>): void {
    if (this.analyzers.has(analyzer.id)) {
      throw new Error(`Analyzer with ID ${analyzer.id} is already registered.`);
    }
    this.analyzers.set(analyzer.id, analyzer);
  }

  get(id: string): DNAAnalyzer<any> | undefined {
    return this.analyzers.get(id);
  }

  getAll(): DNAAnalyzer<any>[] {
    return Array.from(this.analyzers.values());
  }

  clear(): void {
    this.analyzers.clear();
  }
}

export const dnaAnalyzerRegistry = new DNAAnalyzerRegistry();
