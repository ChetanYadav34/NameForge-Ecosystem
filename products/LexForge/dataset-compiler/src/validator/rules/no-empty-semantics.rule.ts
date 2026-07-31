import { SemanticWord, ValidationWarning, PipelineModuleMetadata } from "../../types/index.js";
import { ValidationContext, ValidationRule } from "./base.rule.js";

/**
 * Validates that all semantic arrays do not contain any empty strings.
 */
export class NoEmptySemanticsRule implements ValidationRule<SemanticWord> {
  readonly name = "No Empty Semantics";
  readonly metadata: PipelineModuleMetadata = {
    id: "validator.rule.no-empty-semantics",
    name: "NoEmptySemanticsRule",
    version: "1.0.0",
    stage: "validate",
    priority: 60,
    requiresModules: [],
    requiresFeatures: [],
    producesFeatures: [],
    author: "LexForge",
  };

  readonly isBlocking = true;
  
  validate(record: SemanticWord, _context: ValidationContext): ValidationWarning | null {
    const arraysToCheck: (keyof SemanticWord)[] = [
      "definitions",
      "synonyms",
      "antonyms",
      "hypernyms",
      "hyponyms",
      "domains",
      "sources",
      "partOfSpeech"
    ];

    for (const key of arraysToCheck) {
      const arr = record[key] as string[] | undefined;
      if (arr && arr.length > 0) {
        for (const item of arr) {
          if (item.trim() === "") {
            return {
              word: record.word,
              rule: this.name,
              issue: `Array '${String(key)}' contains an empty string.`,
            };
          }
        }
      }
    }

    return null;
  }
}
