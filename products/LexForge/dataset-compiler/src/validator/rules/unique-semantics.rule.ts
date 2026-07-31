import { SemanticWord, ValidationWarning, PipelineModuleMetadata } from "../../types/index.js";
import { ValidationContext, ValidationRule } from "./base.rule.js";

/**
 * Validates that all semantic arrays (definitions, synonyms, hypernyms, hyponyms, antonyms, domains)
 * do not contain duplicate values.
 */
export class UniqueSemanticsRule implements ValidationRule<SemanticWord> {
  readonly name = "Unique Semantics";
  readonly metadata: PipelineModuleMetadata = {
    id: "validator.rule.unique-semantics",
    name: "UniqueSemanticsRule",
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
    ];

    for (const key of arraysToCheck) {
      const arr = record[key] as string[] | undefined;
      if (arr && arr.length > 0) {
        const uniqueSize = new Set(arr).size;
        if (uniqueSize !== arr.length) {
          return {
            word: record.word,
            rule: this.name,
            issue: `Array '${String(key)}' contains duplicate values.`,
          };
        }
      }
    }

    return null;
  }
}
