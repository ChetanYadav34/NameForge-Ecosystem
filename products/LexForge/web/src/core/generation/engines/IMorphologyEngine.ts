import { CandidateWord } from '../strategies/IGenerationStrategy';

export interface IMorphologyEngine {
  segment(word: string): string[];
  combine(roots: string[]): string;
  blend(wordA: string, wordB: string): string;
}
