import { CandidateBuilder } from "./types";

class CandidateBuilderRegistry {
  private builders: Map<string, CandidateBuilder> = new Map();

  register(builder: CandidateBuilder): void {
    if (this.builders.has(builder.id)) {
      throw new Error(`Builder with ID ${builder.id} is already registered.`);
    }
    this.builders.set(builder.id, builder);
  }

  get(id: string): CandidateBuilder | undefined {
    return this.builders.get(id);
  }

  getAll(): CandidateBuilder[] {
    return Array.from(this.builders.values());
  }

  clear(): void {
    this.builders.clear();
  }
}

export const builderRegistry = new CandidateBuilderRegistry();
