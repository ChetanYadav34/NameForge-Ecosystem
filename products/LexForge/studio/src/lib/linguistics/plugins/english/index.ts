import { ILanguagePlugin, LanguageCapabilities } from "../types";
import { Phoneme, Grapheme } from "../../models/types";
import { ENGLISH_PHONEMES } from "./phonemes";
import { mapEnglishOrthography } from "./orthography";

export class EnglishLanguagePlugin implements ILanguagePlugin {
  public readonly id = "lang:en";
  public readonly name = "English";
  public readonly version = "1.0.0";
  
  public readonly capabilities: LanguageCapabilities = {
    supportsIPA: true,
    supportsStress: true,
    supportsTone: false,
    supportsRomanization: false,
    supportsMorphology: true,
    supportsCompoundWords: true,
    supportsTrademarkValidation: false,
  };

  public getPhonemes(): Phoneme[] {
    return ENGLISH_PHONEMES;
  }

  public getGraphemes(): Grapheme[] {
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    return letters.map((l) => ({
      symbol: l,
      script: "latin",
    }));
  }

  public mapOrthography(phonemes: Phoneme[]): string {
    return mapEnglishOrthography(phonemes);
  }
}
