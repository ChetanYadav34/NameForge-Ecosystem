import { CandidateWord } from '../strategies/IGenerationStrategy';

export class CandidateFilteringService {
  public filter(candidates: CandidateWord[]): CandidateWord[] {
    const seen = new Set<string>();
    const filtered: CandidateWord[] = [];

    for (const c of candidates) {
      const lower = c.word.toLowerCase();
      // Duplicates
      if (seen.has(lower)) continue;
      
      // Length validation
      if (lower.length < 3 || lower.length > 15) continue;
      
      // Invalid characters
      if (/[^a-z]/i.test(lower)) continue;

      seen.add(lower);
      filtered.push(c);
    }

    return filtered;
  }
}
