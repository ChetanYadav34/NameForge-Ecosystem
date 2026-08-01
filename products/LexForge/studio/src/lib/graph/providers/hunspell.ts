import { LexEntry } from "../../dataset/types";
import { GraphRelationshipProvider, GraphRelationship } from "../types";
import { registerProvider, registerRelationship } from "./registry";

const HunspellProvider: GraphRelationshipProvider = {
  id: "hunspell",
  name: "Hunspell Morphology",
  priority: 10,
  relationships: ["inflection", "derivation"],
  build: async (word: LexEntry): Promise<GraphRelationship[]> => {
    const relationships: GraphRelationship[] = [];

    if (word.inflections) {
      for (const inf of word.inflections) {
        relationships.push({
          source: word.word,
          target: inf,
          relationship: "inflection",
          provider: "hunspell",
          weight: 1,
          bidirectional: false
        });
      }
    }

    if (word.derivations) {
      for (const der of word.derivations) {
        relationships.push({
          source: word.word,
          target: der,
          relationship: "derivation",
          provider: "hunspell",
          weight: 1,
          bidirectional: false
        });
      }
    }

    return relationships;
  }
};

registerProvider(HunspellProvider);

registerRelationship({
  id: "inflection",
  label: "Inflections",
  color: "#4A90E2", // Blue
  visible: true,
  provider: "hunspell"
});

registerRelationship({
  id: "derivation",
  label: "Derivations",
  color: "#50E3C2", // Teal
  visible: true,
  provider: "hunspell"
});

export default HunspellProvider;
