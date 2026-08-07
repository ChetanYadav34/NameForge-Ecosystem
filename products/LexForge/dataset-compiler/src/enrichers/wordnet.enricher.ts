import fs from "fs";
import path from "path";
import { BaseEnricher } from "./base.enricher.js";
import { PhonologyWord, SemanticWord, TransformResult, PipelineModuleMetadata } from "../types/index.js";
import { ResourceRegistry } from "../registry/resource.registry.js";
import { logger } from "../utils/logger.js";

interface WordNetSense {
  id: string;
  synset: string;
  antonym?: string[];
  [key: string]: any;
}

interface WordNetEntry {
  [pos: string]: {
    sense: WordNetSense[];
  };
}

interface WordNetSynset {
  definition?: string[];
  members?: string[];
  hypernym?: string[];
  domain_topic?: string[];
  domain_region?: string[];
  [key: string]: any;
}

export class WordNetEnricher extends BaseEnricher<PhonologyWord, SemanticWord> {
  readonly name = "WordNet Enrichment";
  readonly metadata: PipelineModuleMetadata = {
    id: "enricher.wordnet",
    name: "WordNet Enricher",
    version: "1.0.0",
    stage: "enrich",
    priority: 50,
    requiresModules: ["transformer.ipaToPhonology"],
    requiresFeatures: ["feature.phonology", "feature.word"],
    producesFeatures: ["feature.wordnet"],
    author: "LexForge",
  };
  private wordnetDir: string = "";
  private synsets = new Map<string, WordNetSynset>();
  private entries = new Map<string, WordNetEntry>();
  private hypernymToHyponyms = new Map<string, string[]>();

  constructor() {
    super();
  }

  private cleanString(str: string): string {
    return str
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private deduplicate<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
  }

  private translatePos(pos: string): string {
    switch (pos) {
      case "n": return "noun";
      case "v": return "verb";
      case "a":
      case "s": return "adjective";
      case "r": return "adverb";
      default: return pos;
    }
  }

  private extractLemmaFromSenseId(senseId: string): string {
    // Sense ID format: lemma%lex_sense...
    const parts = senseId.split("%");
    if (parts.length > 0) {
      return this.cleanString(parts[0]);
    }
    return senseId;
  }

  private loadWordNetData() {
    if (this.synsets.size > 0) return; // Already loaded

    const resource = ResourceRegistry.get("resource.wordnet");
    this.wordnetDir = resource.path;

    logger.info("Loading WordNet semantic data...");
    
    if (!fs.existsSync(this.wordnetDir)) {
      logger.warn(`WordNet directory not found at ${this.wordnetDir}. Semantic enrichment will be skipped.`);
      return;
    }

    ResourceRegistry.markLoaded(resource.id);

    const files = fs.readdirSync(this.wordnetDir);
    
    const synsetFiles = files.filter(f => 
      f.startsWith("noun.") || 
      f.startsWith("verb.") || 
      f.startsWith("adj.") || 
      f.startsWith("adv.")
    );
    
    const entryFiles = files.filter(f => f.startsWith("entries-"));

    // Load Synsets
    for (const file of synsetFiles) {
      const filePath = path.join(this.wordnetDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      for (const [id, synset] of Object.entries(data)) {
        this.synsets.set(id, synset as WordNetSynset);
        
        // Build reverse index for hyponyms
        if ((synset as WordNetSynset).hypernym) {
          for (const hypId of (synset as WordNetSynset).hypernym!) {
            if (!this.hypernymToHyponyms.has(hypId)) {
              this.hypernymToHyponyms.set(hypId, []);
            }
            this.hypernymToHyponyms.get(hypId)!.push(id);
          }
        }
      }
    }

    // Load Entries
    for (const file of entryFiles) {
      const filePath = path.join(this.wordnetDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      for (const [word, entry] of Object.entries(data)) {
        // Only store if it's a lowercase match to simplify lookups
        this.entries.set(word.toLowerCase(), entry as WordNetEntry);
      }
    }
    
    logger.info(`Loaded ${this.synsets.size} synsets and ${this.entries.size} entries.`);
  }

  async enrich(records: PhonologyWord[]): Promise<TransformResult<SemanticWord>> {
    this.loadWordNetData();

    const output: SemanticWord[] = [];
    let enrichedCount = 0;
    const warnings: string[] = [];

    for (const record of records) {
      const posList: string[] = [];
      const definitions: string[] = [];
      const synonyms: string[] = [];
      const antonyms: string[] = [];
      const hypernyms: string[] = [];
      const hyponyms: string[] = [];
      const domains: string[] = [];
      const sources: string[] = ["words_alpha"];

      if (record.arpabet) {
        sources.push("cmudict");
      }

      const wordKey = record.word.toLowerCase();
      const entry = this.entries.get(wordKey);

      if (entry) {
        sources.push("wordnet");
        enrichedCount++;

        for (const [pos, posData] of Object.entries(entry)) {
          // Exclude internal keys like 'pronunciation' if any, though our interface targets pos keys
          if (pos === "pronunciation") continue;
          
          posList.push(this.translatePos(pos));

          for (const sense of posData.sense || []) {
            // Antonyms are linked via sense IDs
            if (sense.antonym) {
              for (const antId of sense.antonym) {
                antonyms.push(this.extractLemmaFromSenseId(antId));
              }
            }

            const synset = this.synsets.get(sense.synset);
            if (synset) {
              if (synset.definition) {
                definitions.push(...synset.definition.map(d => this.cleanString(d)));
              }
              
              if (synset.members) {
                synonyms.push(...synset.members
                  .map(m => this.cleanString(m))
                  .filter(m => m.toLowerCase() !== wordKey) // exclude self
                );
              }

              if (synset.domain_topic) {
                for (const dtId of synset.domain_topic) {
                  const dtSynset = this.synsets.get(dtId);
                  if (dtSynset && dtSynset.members) {
                    domains.push(...dtSynset.members.map(m => this.cleanString(m)));
                  }
                }
              }

              if (synset.domain_region) {
                for (const drId of synset.domain_region) {
                  const drSynset = this.synsets.get(drId);
                  if (drSynset && drSynset.members) {
                    domains.push(...drSynset.members.map(m => this.cleanString(m)));
                  }
                }
              }

              if (synset.hypernym) {
                for (const hypId of synset.hypernym) {
                  const hypSynset = this.synsets.get(hypId);
                  if (hypSynset && hypSynset.members) {
                    hypernyms.push(...hypSynset.members.map(m => this.cleanString(m)));
                  }
                }
              }

              const hyponymIds = this.hypernymToHyponyms.get(sense.synset);
              if (hyponymIds) {
                for (const hypId of hyponymIds) {
                  const hypSynset = this.synsets.get(hypId);
                  if (hypSynset && hypSynset.members) {
                    hyponyms.push(...hypSynset.members.map(m => this.cleanString(m)));
                  }
                }
              }
            }
          }
        }
      }

      output.push({
        ...record,
        partOfSpeech: this.deduplicate(posList),
        definitions: this.deduplicate(definitions),
        synonyms: this.deduplicate(synonyms),
        antonyms: this.deduplicate(antonyms),
        hypernyms: this.deduplicate(hypernyms),
        hyponyms: this.deduplicate(hyponyms),
        domains: this.deduplicate(domains),
        sources: this.deduplicate(sources),
      });
    }

    return {
      records: output,
      transformedCount: enrichedCount,
      skippedCount: records.length - enrichedCount,
      warnings,
    };
  }
}
