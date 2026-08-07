export interface IPhoneticEngine {
  getIPA(word: string): string;
  evaluateFlow(word: string): number;
  countSyllables(word: string): number;
}
