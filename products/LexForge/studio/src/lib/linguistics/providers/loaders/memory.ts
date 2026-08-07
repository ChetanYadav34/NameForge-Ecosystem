import { ICorpusProvider } from "../corpus";
import { Morpheme } from "../../models/types";

import greek from "../../data/morphemes/greek.json";
import latin from "../../data/morphemes/latin.json";
import germanic from "../../data/morphemes/germanic.json";
import tech from "../../data/morphemes/modern-tech.json";
import finance from "../../data/morphemes/finance.json";
import health from "../../data/morphemes/healthcare.json";
import luxury from "../../data/morphemes/luxury.json";
import ai from "../../data/morphemes/ai.json";
import energy from "../../data/morphemes/energy.json";
import nature from "../../data/morphemes/nature.json";

/**
 * Basic in-memory implementation of ICorpusProvider.
 * Used for fast lookup of predefined linguistic data.
 */
export class MemoryCorpusProvider implements ICorpusProvider {
  public readonly id = "corpus:memory:default";
  public readonly name = "Memory Dataset";
  public readonly version = "1.0.0";
  
  private morphemes: Map<string, Morpheme[]> = new Map();
  private lexicon: Set<string> = new Set();

  public async load(): Promise<void> {
    const allDatasets = [
      ...greek, ...latin, ...germanic, ...tech, ...finance,
      ...health, ...luxury, ...ai, ...energy, ...nature
    ];

    for (const entry of allDatasets) {
      this.lexicon.add(entry.orthography);
      const morpheme: Morpheme = {
        id: entry.id,
        type: "root", // simplified for now
        phonology: [], // To be populated properly with Phoneme objects later
        orthography: entry.orthography,
        origin: entry.origin,
        semanticIds: entry.semanticTags.map((tag: string) => `sem:${tag}`),
        metadata: {
          ...entry.metadata,
          rarity: (entry.metadata as any).rarity ?? (1 - entry.metadata.frequency)
        }
      };

      for (const semId of morpheme.semanticIds) {
        if (!this.morphemes.has(semId)) {
          this.morphemes.set(semId, []);
        }
        this.morphemes.get(semId)!.push(morpheme);
      }
    }
  }

  public async lookupBySemantic(semanticId: string): Promise<Morpheme[]> {
    return this.morphemes.get(semanticId) || [];
  }

  public async hasWord(word: string): Promise<boolean> {
    return this.lexicon.has(word.toLowerCase());
  }
}
