import { BaseEnricher } from "./base.enricher.js";
import { MorphologyWord, FrequencyWord, TransformResult, PipelineModuleMetadata, ResourceState } from "../types/index.js";
import { ResourceRegistry } from "../registry/resource.registry.js";
import { logger } from "../utils/logger.js";
import fs from "node:fs";

interface FrequencyDataMap {
  [word: string]: number;
}

export class FrequencyEnricher extends BaseEnricher<MorphologyWord, FrequencyWord> {
  readonly name = "Frequency Enrichment";
  readonly metadata: PipelineModuleMetadata = {
    id: "enricher.frequency",
    name: "Frequency Enricher",
    version: "1.0.0",
    stage: "enrich",
    priority: 70, // Run after Hunspell (60)
    requiresModules: ["enricher.hunspell"],
    requiresFeatures: ["feature.word"],
    producesFeatures: ["feature.frequency", "feature.frequencyRank", "feature.frequencyPercentile", "feature.frequencyBand", "feature.frequencySource"],
    author: "LexForge",
  };

  private frequencyMap: FrequencyDataMap = {};
  private activeSource = "none";
  private isResourceAvailable = false;
  private loaded = false;

  private calculateBand(zipf: number): "very-common" | "common" | "uncommon" | "rare" | "very-rare" {
    if (zipf >= 6.0) return "very-common";
    if (zipf >= 4.5) return "common";
    if (zipf >= 3.0) return "uncommon";
    if (zipf >= 1.5) return "rare";
    return "very-rare";
  }

  private loadData() {
    if (this.loaded) return;
    this.loaded = true;

    const resources = ["resource.wordfreq", "resource.subtlex"];

    // We try to find the first validated resource according to priority
    for (const resId of resources) {
      try {
        if (ResourceRegistry.getState(resId) === ResourceState.VALIDATED || ResourceRegistry.getState(resId) === ResourceState.LOADED) {
          this.isResourceAvailable = true;
          this.activeSource = resId.replace("resource.", "");
          
          if (ResourceRegistry.getState(resId) === ResourceState.VALIDATED) {
             ResourceRegistry.markLoaded(resId);
          }
          
          // Load frequencies from the CSV file
          if (this.activeSource === "wordfreq") {
             const csvPath = ResourceRegistry.get(resId).path;
             const content = fs.readFileSync(csvPath, "utf-8");
             const lines = content.split(/\r?\n/);
             for (let i = 1; i < lines.length; i++) {
               const line = lines[i].trim();
               if (!line) continue;
               const [word, zipf] = line.split(",");
               if (word && zipf) {
                 this.frequencyMap[word] = parseFloat(zipf);
               }
             }
          }
          break;
        }
      } catch (e) {
        // Not loaded or not registered
      }
    }

    if (!this.isResourceAvailable) {
      logger.info(`No frequency resources found in LOADED state. Proceeding without frequency data.`);
    }
  }

  async enrich(records: MorphologyWord[]): Promise<TransformResult<FrequencyWord>> {
    this.loadData();

    let transformedCount = 0;
    
    // Pass 1: enrich with base Zipf values
    const intermediateRecords: FrequencyWord[] = records.map(record => {
      const frequencyValue = this.frequencyMap[record.word];
      if (frequencyValue !== undefined) {
        const sources = [...(record.sources || [])];
        if (!sources.includes(this.activeSource)) {
          sources.push(this.activeSource);
        }
        return {
          ...record,
          sources,
          frequency: {
            zipf: frequencyValue,
            band: this.calculateBand(frequencyValue),
            source: this.activeSource,
          }
        };
      }
      return { ...record };
    });

    // Pass 2: calculate LexForge percentiles and ranks
    // We only rank words that have a frequency
    const withFreq = intermediateRecords.filter(r => r.frequency !== undefined);
    
    // Sort descending by zipf to compute rank
    withFreq.sort((a, b) => b.frequency!.zipf - a.frequency!.zipf);
    
    const totalWithFreq = withFreq.length;
    
    // Assign ranks and percentiles
    let currentRank = 1;
    for (let i = 0; i < totalWithFreq; i++) {
      const record = withFreq[i];
      // Handle ties in rank
      if (i > 0 && record.frequency!.zipf < withFreq[i - 1].frequency!.zipf) {
        currentRank = i + 1;
      }
      
      record.frequency!.lexforgeRank = currentRank;
      record.frequency!.lexforgePercentile = totalWithFreq > 1 ? 
        ((totalWithFreq - currentRank) / (totalWithFreq - 1)) * 100 : 100;
        
      transformedCount++;
    }

    // Sort intermediate records back by word since we mutated the original array structure?
    // No, intermediateRecords was not sorted, only withFreq was sorted. withFreq contains references.
    
    return {
      records: intermediateRecords,
      transformedCount,
      skippedCount: records.length - transformedCount,
      warnings: [],
    };
  }
}
