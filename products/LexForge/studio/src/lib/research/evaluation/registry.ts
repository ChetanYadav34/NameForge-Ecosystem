import { EvaluationAnalyzer } from "./types";

class EvaluationRegistry {
  private analyzers: Map<string, EvaluationAnalyzer> = new Map();

  register(analyzer: EvaluationAnalyzer): void {
    if (this.analyzers.has(analyzer.id)) {
      throw new Error(`Analyzer with ID ${analyzer.id} is already registered.`);
    }
    this.analyzers.set(analyzer.id, analyzer);
  }

  get(id: string): EvaluationAnalyzer | undefined {
    return this.analyzers.get(id);
  }

  getAll(): EvaluationAnalyzer[] {
    return Array.from(this.analyzers.values());
  }

  clear(): void {
    this.analyzers.clear();
  }
}

export const evaluationRegistry = new EvaluationRegistry();
