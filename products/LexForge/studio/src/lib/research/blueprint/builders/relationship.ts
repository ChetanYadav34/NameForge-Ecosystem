import { BlueprintFragment, PatternCluster } from "../types";

export class RelationshipEngine {
  buildCompatible(fragments: BlueprintFragment[]): PatternCluster[] {
    return this.buildRelationships(fragments, "compatible");
  }

  buildIncompatible(fragments: BlueprintFragment[]): PatternCluster[] {
    return this.buildRelationships(fragments, "incompatible");
  }

  private buildRelationships(fragments: BlueprintFragment[], relType: string): PatternCluster[] {
    const relationships: PatternCluster[] = [];
    for (const frag of fragments) {
      if (frag.type === "relationship" && frag.data.relationshipType === relType) {
        relationships.push({
          id: crypto.randomUUID(),
          name: frag.data.name || `Relationship Group (${relType})`,
          description: frag.data.description || `Extracted ${relType} relationships`,
          patterns: frag.trace,
          signaturePatterns: frag.trace
        });
      }
    }
    return relationships;
  }
}
