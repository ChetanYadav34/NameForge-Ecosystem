export interface IOntologyEngine {
  mapToDomain(word: string): string[];
  getDomainRelevance(word: string, industry: string): number;
}
