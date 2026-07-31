import { ValidationRule, ValidationContext } from "./base.rule.js";
import { FrequencyWord, ValidationWarning, PipelineModuleMetadata } from "../../types/index.js";

export class FrequencyRule implements ValidationRule<FrequencyWord> {
  readonly name = "Frequency Rule";
  readonly isBlocking = false;
  
  readonly metadata: PipelineModuleMetadata = {
    id: "validator.frequency",
    name: "Frequency Rule",
    version: "1.0.0",
    stage: "validate",
    priority: 150,
    requiresModules: ["enricher.frequency"],
    requiresFeatures: ["feature.frequency"],
    producesFeatures: [],
    author: "LexForge",
  };

  private validBands = new Set(["very-common", "common", "uncommon", "rare", "very-rare"]);

  validate(record: FrequencyWord, context: ValidationContext): ValidationWarning | null {
    if (record.frequency) {
      const { zipf, band, lexforgeRank, lexforgePercentile } = record.frequency;

      if (zipf < 0) {
        return {
          word: record.word,
          rule: this.metadata.id,
          issue: `Invalid zipf frequency value: ${zipf}. Must be >= 0.`
        };
      }

      if (band && !this.validBands.has(band)) {
        return {
          word: record.word,
          rule: this.metadata.id,
          issue: `Invalid frequency band: ${band}.`
        };
      }

      if (lexforgeRank !== undefined && lexforgeRank <= 0) {
        return {
          word: record.word,
          rule: this.metadata.id,
          issue: `Invalid lexforgeRank: ${lexforgeRank}. Must be > 0.`
        };
      }

      if (lexforgePercentile !== undefined && (lexforgePercentile < 0 || lexforgePercentile > 100)) {
        return {
          word: record.word,
          rule: this.metadata.id,
          issue: `Invalid lexforgePercentile: ${lexforgePercentile}. Must be between 0 and 100.`
        };
      }
    }

    return null;
  }
}
