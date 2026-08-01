import { LexEntry } from "../../dataset/types";
import { GraphRelationshipProvider, GraphRelationship } from "../types";
import { registerProvider, registerRelationship } from "./registry";

const FamilyProvider: GraphRelationshipProvider = {
  id: "family",
  name: "Word Families",
  priority: 30,
  relationships: ["family"],
  build: async (word: LexEntry): Promise<GraphRelationship[]> => {
    const relationships: GraphRelationship[] = [];

    // The word belongs to a familyId. We can create an edge from the word to the family node.
    if (word.familyId) {
      relationships.push({
        source: word.word,
        target: word.familyId,
        relationship: "family",
        provider: "family",
        weight: 2,
        bidirectional: true // family node points to word, word points to family
      });
      
      // If we have the full wordFamily array, we could link all members to the family node here,
      // but the builder will do that dynamically as nodes are requested.
      // Currently, we just add the link to the family node itself.
      // And we might want to also add edges to other family members if we prefer member-to-member edges.
      // The prompt suggests a Family node.
    }

    return relationships;
  }
};

registerProvider(FamilyProvider);

registerRelationship({
  id: "family",
  label: "Word Family",
  color: "#F5F5F5", // White/Light grey for family
  visible: true,
  provider: "family"
});

export default FamilyProvider;
