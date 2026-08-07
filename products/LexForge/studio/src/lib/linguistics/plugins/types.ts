import { Phoneme, Grapheme } from "../models/types";

export interface LanguageCapabilities {
  readonly supportsIPA: boolean;
  readonly supportsStress: boolean;
  readonly supportsTone: boolean;
  readonly supportsRomanization: boolean;
  readonly supportsMorphology: boolean;
  readonly supportsCompoundWords: boolean;
  readonly supportsTrademarkValidation: boolean;
}

/**
 * Universal Interface for Language Plugins.
 * No language-specific logic can exist in the core compiler.
 */
export interface ILanguagePlugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly capabilities: LanguageCapabilities;

  /**
   * Returns the valid phoneme inventory for this language.
   */
  getPhonemes(): Phoneme[];

  /**
   * Returns the valid orthographic graphemes.
   */
  getGraphemes(): Grapheme[];

  /**
   * Maps a sequence of Phonemes to a string of Orthographic Graphemes.
   */
  mapOrthography(phonemes: Phoneme[]): string;
}
