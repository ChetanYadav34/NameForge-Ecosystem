import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerContext } from "../types/compiler.js";
import { KnowledgePackage, KnowledgePackageManifest, KnowledgePackageImporter } from "../types/knowledge-package.js";
import { LexEntry } from "../types/index.js";
import { logger } from "../utils/logger.js";

const wikipronManifest: KnowledgePackageManifest = {
  id: "package.wikipron",
  version: "1.0",
  schemaVersion: "2.0.0",
  dependencies: [],
  license: "Wiktionary License",
  importer: "WikiPronPackageImporter",
  mergePolicy: {
    ipa: "highest-confidence",
    _new_entity: "append-only"
  },
  evidencePolicy: "WikiPron",
  confidencePolicy: "static:0.8",
  authoritativeFields: ["ipa"],
  enrichableFields: [],
  prohibitedFields: [],
};

export class WikiPronPackageImporter implements KnowledgePackageImporter {
  async *import(context: CompilerContext): AsyncGenerator<Partial<LexEntry>, void, unknown> {
    const wikipronDir = "D:\\Projects\\resourses\\New Resources\\wikipron-master\\languages";
    
    if (!fs.existsSync(wikipronDir)) {
      logger.warn("WikiPron directory not found, skipping.");
      return;
    }

    const files = fs.readdirSync(wikipronDir).filter(f => f.endsWith(".tsv"));
    
    for (const file of files) {
      const filePath = path.join(wikipronDir, file);
      // Example file: eng_latn_broad.tsv
      const langMatch = file.match(/^([a-z]{3})_/);
      if (!langMatch) continue;
      const lang = langMatch[1];
      
      const rl = createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
      });
      
      for await (const line of rl) {
        if (!line.trim()) continue;
        const [word, ipa] = line.split("\t");
        if (!word || !ipa) continue;
        
        yield {
          word,
          ipa: ipa.replace(/\//g, ""), // clean slashes
          // For V7, we tag language on sources or domains if we don't have a lang field
          sources: [`wikipron:${lang}`],
        };
      }
    }
  }
}

export const WikiPronPackage: KnowledgePackage = {
  manifest: wikipronManifest,
  importer: new WikiPronPackageImporter()
};
