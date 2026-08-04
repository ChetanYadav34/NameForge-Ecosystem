import { ExplanationBuilder } from "./types";

class ExplanationBuilderRegistry {
  private builders: Map<string, ExplanationBuilder> = new Map();

  register(builder: ExplanationBuilder): void {
    if (this.builders.has(builder.id)) {
      throw new Error(`ExplanationBuilder with ID ${builder.id} is already registered.`);
    }
    this.builders.set(builder.id, builder);
  }

  get(id: string): ExplanationBuilder | undefined {
    return this.builders.get(id);
  }

  getAll(): ExplanationBuilder[] {
    return Array.from(this.builders.values());
  }

  clear(): void {
    this.builders.clear();
  }
}

export const explanationBuilderRegistry = new ExplanationBuilderRegistry();
