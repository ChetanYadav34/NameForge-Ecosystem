import { BlueprintFragment, GenerationRule } from "../types";

export class ConstraintBuilder {
  buildConstraints(fragments: BlueprintFragment[]): GenerationRule[] {
    const constraints: GenerationRule[] = [];
    for (const frag of fragments) {
      if (frag.type === "constraint") {
        constraints.push({
          id: crypto.randomUUID(),
          type: "constraint",
          description: frag.data.description || "Unspecified constraint",
          signaturePatterns: frag.trace
        });
      }
    }
    return constraints;
  }
}
