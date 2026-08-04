import { FilterRule } from "./types";

class FilteringRegistry {
  private rules: Map<string, FilterRule> = new Map();

  register(rule: FilterRule): void {
    if (this.rules.has(rule.id)) {
      throw new Error(`FilterRule with ID ${rule.id} is already registered.`);
    }
    this.rules.set(rule.id, rule);
  }

  get(id: string): FilterRule | undefined {
    return this.rules.get(id);
  }

  getAll(): FilterRule[] {
    return Array.from(this.rules.values());
  }

  clear(): void {
    this.rules.clear();
  }
}

export const filteringRegistry = new FilteringRegistry();
