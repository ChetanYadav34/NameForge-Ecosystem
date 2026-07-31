import fs from "node:fs";
import path from "node:path";
import { BaseEnricher } from "./base.enricher.js";
import { SemanticWord, MorphologyWord, TransformResult, PipelineModuleMetadata } from "../types/index.js";
import { ResourceRegistry } from "../registry/resource.registry.js";
import { logger } from "../utils/logger.js";

interface AffixRule {
  type: "PFX" | "SFX";
  flag: string;
  crossProduct: boolean;
  strip: string;
  affix: string;
  condition: RegExp;
}

interface HunspellWordData {
  lemma: string;
  stem?: string;
  inflections: Set<string>;
  derivations: Set<string>;
  affixFlags: string[];
}

export class HunspellEnricher extends BaseEnricher<SemanticWord, MorphologyWord> {
  readonly name = "Hunspell Morphology Enrichment";
  readonly metadata: PipelineModuleMetadata = {
    id: "enricher.hunspell",
    name: "Hunspell Enricher",
    version: "1.0.0",
    stage: "enrich",
    priority: 60,
    requiresModules: ["enricher.wordnet"],
    requiresFeatures: ["feature.word"],
    producesFeatures: ["feature.lemma", "feature.stem", "feature.inflections", "feature.derivations"],
    author: "LexForge",
  };

  private rules = new Map<string, AffixRule[]>();
  private wordData = new Map<string, HunspellWordData>();

  // Known inflectional vs derivational flags for en_US-large
  private inflectionalFlags = new Set(["S", "D", "G", "T", "M"]);
  private derivationalFlags = new Set(["A", "I", "U", "C", "E", "F", "K", "V", "N", "X", "H", "Y", "J", "R", "Z", "P", "B", "L"]);

  constructor() {
    super();
  }

  private loadHunspellData() {
    const resource = ResourceRegistry.get("resource.hunspell");
    const hunspellDir = resource.path;

    logger.info("Loading Hunspell morphological data...");

    if (!fs.existsSync(hunspellDir)) {
      logger.warn(`Hunspell directory not found at ${hunspellDir}. Morphological enrichment will be skipped.`);
      return;
    }

    ResourceRegistry.markLoaded(resource.id);

    const affPath = path.join(hunspellDir, "en_US-large.aff");
    const dicPath = path.join(hunspellDir, "en_US-large.dic");

    if (!fs.existsSync(affPath) || !fs.existsSync(dicPath)) {
      logger.warn(`Missing en_US-large.aff or en_US-large.dic in ${hunspellDir}.`);
      return;
    }

    this.parseAff(affPath);
    this.parseDic(dicPath);
    
    logger.info(`Loaded ${this.wordData.size} words from Hunspell.`);
  }

  private parseAff(affPath: string) {
    const lines = fs.readFileSync(affPath, "utf-8").split("\n");
    let currentFlag = "";
    let currentType = "";
    let crossProduct = false;

    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith("#")) continue;

      const parts = line.split(/\s+/);
      const type = parts[0];

      if (type === "PFX" || type === "SFX") {
        if (parts.length === 4 && (parts[2] === "Y" || parts[2] === "N")) {
          // Header: PFX flag cross_product count
          currentFlag = parts[1];
          currentType = type;
          crossProduct = parts[2] === "Y";
        } else if (parts.length >= 4) {
          // Rule: PFX flag strip affix condition
          const flag = parts[1];
          if (flag !== currentFlag) continue;

          const strip = parts[2] === "0" ? "" : parts[2];
          const affix = parts[3] === "0" ? "" : parts[3];
          let conditionStr = parts[4] || ".";
          if (conditionStr === ".") conditionStr = ".*";
          
          let conditionRegExp: RegExp;
          try {
            if (currentType === "PFX") {
              conditionRegExp = new RegExp("^" + conditionStr);
            } else {
              conditionRegExp = new RegExp(conditionStr + "$");
            }
          } catch (e) {
            conditionRegExp = /.*/;
          }

          if (!this.rules.has(flag)) {
            this.rules.set(flag, []);
          }

          this.rules.get(flag)!.push({
            type: currentType as "PFX" | "SFX",
            flag,
            crossProduct,
            strip,
            affix,
            condition: conditionRegExp
          });
        }
      }
    }
  }

  private parseDic(dicPath: string) {
    const lines = fs.readFileSync(dicPath, "utf-8").split("\n");
    // The first line is the count, skip it
    for (let i = 1; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      
      const slashIdx = line.indexOf("/");
      let word = line;
      let flags = "";

      if (slashIdx !== -1) {
        word = line.substring(0, slashIdx);
        flags = line.substring(slashIdx + 1);
      }

      word = word.toLowerCase();

      let data = this.wordData.get(word);
      if (!data) {
        data = {
          lemma: word,
          stem: word, // Basic: stem = lemma
          inflections: new Set<string>([word]),
          derivations: new Set<string>(),
          affixFlags: flags ? flags.split("") : []
        };
        this.wordData.set(word, data);
      } else if (flags) {
        // If already exists, just add flags if any
        data.affixFlags.push(...flags.split(""));
      }

      const prefixes: string[] = [];
      const suffixes: string[] = [];
      
      for (const flag of flags) {
        const rules = this.rules.get(flag) || [];
        for (const rule of rules) {
          if (rule.condition.test(word)) {
            let strippedWord = word;
            if (rule.strip) {
              if (rule.type === "PFX" && word.startsWith(rule.strip)) {
                strippedWord = word.substring(rule.strip.length);
              } else if (rule.type === "SFX" && word.endsWith(rule.strip)) {
                strippedWord = word.substring(0, word.length - rule.strip.length);
              } else {
                continue; 
              }
            }

            const newWord = rule.type === "PFX" 
              ? rule.affix + strippedWord 
              : strippedWord + rule.affix;

            if (this.inflectionalFlags.has(flag)) {
              data.inflections.add(newWord);
            } else if (this.derivationalFlags.has(flag)) {
              data.derivations.add(newWord);
            }

            if (rule.crossProduct) {
              if (rule.type === "PFX") prefixes.push(flag);
              else suffixes.push(flag);
            }
          }
        }
      }

      // Handle cross-products
      if (prefixes.length > 0 && suffixes.length > 0) {
        for (const pFlag of prefixes) {
          for (const sFlag of suffixes) {
            for (const pRule of (this.rules.get(pFlag) || [])) {
              if (!pRule.condition.test(word)) continue;
              
              let strippedWord = word;
              if (pRule.strip && word.startsWith(pRule.strip)) {
                strippedWord = word.substring(pRule.strip.length);
              } else if (pRule.strip) continue;
              
              const prefixedWord = pRule.affix + strippedWord;

              for (const sRule of (this.rules.get(sFlag) || [])) {
                if (!sRule.condition.test(prefixedWord)) continue;
                
                let doubleStripped = prefixedWord;
                if (sRule.strip && prefixedWord.endsWith(sRule.strip)) {
                  doubleStripped = prefixedWord.substring(0, prefixedWord.length - sRule.strip.length);
                } else if (sRule.strip) continue;
                
                const finalWord = doubleStripped + sRule.affix;
                
                if (this.derivationalFlags.has(pFlag) || this.derivationalFlags.has(sFlag)) {
                  data.derivations.add(finalWord);
                } else {
                  data.inflections.add(finalWord);
                }
              }
            }
          }
        }
      }
    }

    // Second pass to ensure generated words map back to the lemma
    const newMappings = new Map<string, HunspellWordData>();
    for (const [lemma, data] of this.wordData.entries()) {
      for (const form of data.inflections) {
        if (!this.wordData.has(form) && !newMappings.has(form)) {
          newMappings.set(form, data);
        }
      }
      for (const form of data.derivations) {
        if (!this.wordData.has(form) && !newMappings.has(form)) {
          newMappings.set(form, data);
        }
      }
    }
    
    for (const [form, data] of newMappings.entries()) {
      this.wordData.set(form, data);
    }
  }

  async enrich(records: SemanticWord[]): Promise<TransformResult<MorphologyWord>> {
    if (this.wordData.size === 0) {
      this.loadHunspellData();
    }

    const output: MorphologyWord[] = [];
    const warnings: string[] = [];

    for (const record of records) {
      const word = record.word.toLowerCase();
      const data = this.wordData.get(word);

      const sources = [...record.sources];
      if (data) {
        sources.push("hunspell");
      }

      output.push({
        ...record,
        lemma: data ? data.lemma : undefined,
        stem: data ? data.stem : undefined,
        inflections: data ? Array.from(data.inflections).sort() : [],
        derivations: data ? Array.from(data.derivations).sort() : [],
        sources
      });
    }

    return {
      records: output,
      transformedCount: output.length,
      skippedCount: 0,
      warnings
    };
  }
}
