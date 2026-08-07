import fs from "node:fs";
import { createInterface } from "node:readline";
import { CompilerContext } from "../types/compiler.js";
import { KnowledgePackage, KnowledgePackageManifest, KnowledgePackageImporter } from "../types/knowledge-package.js";
import { LexEntry } from "../types/index.js";
import { logger } from "../utils/logger.js";

const kaikkiManifest: KnowledgePackageManifest = {
  id: "package.kaikki",
  version: "2024",
  schemaVersion: "2.0.0",
  dependencies: [],
  license: "CC-BY-SA 3.0",
  importer: "KaikkiPackageImporter",
  mergePolicy: {
    ipa: "highest-confidence",
    partOfSpeech: "union-deduplicate",
    definitions: "union-deduplicate",
    synonyms: "union-deduplicate",
  },
  evidencePolicy: "Wiktionary",
  confidencePolicy: "static:0.95",
  authoritativeFields: ["ipa", "partOfSpeech", "definitions", "synonyms"],
  enrichableFields: [],
  prohibitedFields: [],
};

export class KaikkiPackageImporter implements KnowledgePackageImporter {
  async *import(context: CompilerContext): AsyncGenerator<Partial<LexEntry>, void, unknown> {
    const kaikkiPath = "D:\\Projects\\resourses\\New Resources\\kaikki.org-dictionary-English.jsonl";
    
    if (!fs.existsSync(kaikkiPath)) {
      logger.warn("Kaikki dictionary not found, skipping.");
      return;
    }

    const rl = createInterface({
      input: fs.createReadStream(kaikkiPath),
      crlfDelay: Infinity,
    });
    
    for await (const line of rl) {
      try {
        const entry = JSON.parse(line);
        if (entry.lang !== "English") continue;
        if (entry.word.includes(" ")) continue; // Skip phrases

        // Extract IPA
        let ipa = "";
        if (entry.sounds) {
          for (const sound of entry.sounds) {
            if (sound.ipa) {
              ipa = sound.ipa;
              break; // Take the first available IPA
            }
          }
        }

        // Extract Senses
        const definitions: string[] = [];
        if (entry.senses) {
          for (const sense of entry.senses) {
             if (sense.raw_glosses) {
                definitions.push(...sense.raw_glosses);
             } else if (sense.glosses) {
                definitions.push(...sense.glosses);
             }
          }
        }

        if (ipa || definitions.length > 0) {
          yield {
            word: entry.word,
            ipa: ipa || undefined,
            definitions: definitions.length > 0 ? definitions : undefined,
            partOfSpeech: entry.pos ? [entry.pos] : undefined,
          };
        }
      } catch (e) {
        // Skip malformed lines
        continue;
      }
    }
  }
}

export const KaikkiPackage: KnowledgePackage = {
  manifest: kaikkiManifest,
  importer: new KaikkiPackageImporter()
};
