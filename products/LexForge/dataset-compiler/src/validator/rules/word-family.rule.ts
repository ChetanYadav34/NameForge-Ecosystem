import { FamilyWord, ValidationWarning } from "../../types/index.js";
import { ValidationRule, ValidationContext } from "./base.rule.js";

/**
 * Validates determinism and integrity of word families.
 */
export class WordFamilyRule implements ValidationRule<FamilyWord> {
  get metadata() {
    return {
      id: "validator.rule.word-family",
      name: "Word Family Check",
      version: "1.0.0",
      stage: "validate" as const,
      priority: 130, // Runs after previous rules
      requiresModules: ["engine.word_family"],
      requiresFeatures: ["feature.familyId", "feature.headword", "feature.wordFamily", "feature.familySize"],
      producesFeatures: [],
      author: "LexForge",
    };
  }

  readonly name = "Word Family";
  readonly isBlocking = false;

  validate(record: FamilyWord, context: ValidationContext): ValidationWarning | null {
    if (!record.familyId) {
      return { word: record.word, rule: "wf", issue: "Word family ID is missing" };
    }

    if (!record.familyId.startsWith("family.")) {
      return { word: record.word, rule: "wf", issue: "Word family ID must start with 'family.'" };
    }

    if (!record.headword) {
      return { word: record.word, rule: "wf", issue: "Word family is missing a headword" };
    }

    if (!record.wordFamily || record.wordFamily.length === 0) {
      return { word: record.word, rule: "wf", issue: "Word family list is empty" };
    }

    if (record.familySize !== record.wordFamily.length) {
      return { word: record.word, rule: "wf", issue: `Family size mismatch: expected ${record.familySize}, got ${record.wordFamily.length}` };
    }

    // Check for duplicates
    const uniqueMembers = new Set(record.wordFamily);
    if (uniqueMembers.size !== record.wordFamily.length) {
      return { word: record.word, rule: "wf", issue: "Word family contains duplicate members" };
    }

    return null;
  }
}
