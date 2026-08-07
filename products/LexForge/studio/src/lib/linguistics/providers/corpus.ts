import { Morpheme } from "../models/types";

/**
 * Interface for Corpus Providers.
 * Abstracted to support JSON, SQLite, CMU Dict, Trie, etc.
 */
export interface ICorpusProvider {
  readonly id: string;
  readonly name: string;
  readonly version: string;

  /**
   * Initializes or loads the corpus data.
   */
  load(): Promise<void>;

  /**
   * Looks up morphemes matching a semantic concept ID.
   */
  lookupBySemantic(semanticId: string): Promise<Morpheme[]>;

  /**
   * Verifies if a given string exists in the corpus (for collision checking).
   */
  hasWord(word: string): Promise<boolean>;
}
