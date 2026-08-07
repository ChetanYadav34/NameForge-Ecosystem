export interface ISemanticEngine {
  getMeaning(word: string): string;
  getSemanticScore(word: string, contextKeywords: string[]): number;
}
