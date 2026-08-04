import { ValidationRule } from "./types";

class ValidationRegistry {
  private rules: Map<string, ValidationRule> = new Map();

  register(rule: ValidationRule): void {
    if (this.rules.has(rule.id)) {
      throw new Error(`Validation rule with ID ${rule.id} is already registered.`);
    }
    this.rules.set(rule.id, rule);
  }

  get(id: string): ValidationRule | undefined {
    return this.rules.get(id);
  }

  getAll(): ValidationRule[] {
    return Array.from(this.rules.values());
  }

  clear(): void {
    this.rules.clear();
  }
}

export const validationRegistry = new ValidationRegistry();
