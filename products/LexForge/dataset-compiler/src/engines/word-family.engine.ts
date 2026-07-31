import { BaseEngine } from "./base.engine.js";
import { FrequencyWord, FinalWord, TransformResult } from "../types/index.js";

export class WordFamilyEngine extends BaseEngine<FrequencyWord, FinalWord> {
  get metadata() {
    return {
      id: "engine.word_family",
      name: "Word Family Engine",
      version: "1.0.0",
      stage: "engine" as const,
      priority: 70, // Runs after enrichers
      requiresModules: ["enricher.hunspell"],
      requiresFeatures: ["feature.lemma", "feature.stem", "feature.inflections", "feature.derivations"],
      producesFeatures: [
        "feature.familyId",
        "feature.headword",
        "feature.wordFamily",
        "feature.familySize",
        "feature.familyConfidence",
      ],
      author: "LexForge",
    };
  }

  async execute(records: FrequencyWord[]): Promise<TransformResult<FinalWord>> {
    const startTime = performance.now();
    
    // Pass 1: Build morphological graph
    const wordToIndex = new Map<string, number>();
    records.forEach((r, i) => wordToIndex.set(r.word, i));

    const adjList: number[][] = Array.from({ length: records.length }, () => []);

    const addEdge = (w1: string, w2: string) => {
      const i1 = wordToIndex.get(w1);
      const i2 = wordToIndex.get(w2);
      if (i1 !== undefined && i2 !== undefined && i1 !== i2) {
        adjList[i1].push(i2);
        adjList[i2].push(i1);
      }
    };

    for (const r of records) {
      if (r.lemma) addEdge(r.word, r.lemma);
      if (r.stem) addEdge(r.word, r.stem);
      for (const inf of r.inflections) addEdge(r.word, inf);
      for (const der of r.derivations) addEdge(r.word, der);
    }

    // Pass 2: Find connected components
    const visited = new Uint8Array(records.length);
    const families: number[][] = [];
    
    for (let i = 0; i < records.length; i++) {
      if (!visited[i]) {
        const comp: number[] = [];
        const q = [i];
        visited[i] = 1;
        
        while (q.length > 0) {
          const u = q.shift()!;
          comp.push(u);
          
          for (const v of adjList[u]) {
            if (!visited[v]) {
              visited[v] = 1;
              q.push(v);
            }
          }
        }
        families.push(comp);
      }
    }

    // Pass 3, 4, 5: Canonical headword, Family IDs, Projection
    const output = new Array<FinalWord>(records.length);

    for (const comp of families) {
      // Find headword
      let bestHeadword = "";
      let maxLemmaCount = -1;
      let minLength = Infinity;

      for (const idx of comp) {
        const w = records[idx].word;
        let lemmaCount = 0;
        
        for (const memberIdx of comp) {
          if (records[memberIdx].lemma === w) {
            lemmaCount++;
          }
        }

        if (lemmaCount > maxLemmaCount) {
          maxLemmaCount = lemmaCount;
          bestHeadword = w;
          minLength = w.length;
        } else if (lemmaCount === maxLemmaCount) {
          if (w.length < minLength) {
            minLength = w.length;
            bestHeadword = w;
          } else if (w.length === minLength) {
            if (bestHeadword === "" || w < bestHeadword) {
              bestHeadword = w;
            }
          }
        }
      }

      const familyId = `family.${bestHeadword}`;
      const wordFamily = Array.from(new Set(comp.map((idx) => records[idx].word))).sort();
      const familySize = wordFamily.length;
      const familyConfidence = 1.0;

      for (const idx of comp) {
        output[idx] = {
          ...records[idx],
          familyId,
          headword: bestHeadword,
          wordFamily,
          familySize,
          familyConfidence,
        };
      }
    }

    const durationMs = performance.now() - startTime;

    return {
      records: output,
      transformedCount: output.length,
      skippedCount: 0,
      warnings: [],
    };
  }
}
