import { LexEntry } from "../../dataset/types";
import { GraphRelationshipProvider, GraphRelationship } from "../types";
import { registerProvider, registerRelationship } from "./registry";

const WordNetProvider: GraphRelationshipProvider = {
  id: "wordnet",
  name: "WordNet Semantics",
  priority: 20,
  relationships: ["synonym", "antonym", "hypernym", "hyponym"],
  build: async (word: LexEntry): Promise<GraphRelationship[]> => {
    const relationships: GraphRelationship[] = [];

    const addRelations = (items: string[] | undefined, relType: string, bidi: boolean) => {
      if (!items) return;
      for (const item of items) {
        relationships.push({
          source: word.word,
          target: item,
          relationship: relType,
          provider: "wordnet",
          weight: 1,
          bidirectional: bidi
        });
      }
    };

    addRelations(word.synonyms, "synonym", true);
    addRelations(word.antonyms, "antonym", true);
    addRelations(word.hypernyms, "hypernym", false);
    addRelations(word.hyponyms, "hyponym", false);

    return relationships;
  }
};

registerProvider(WordNetProvider);

registerRelationship({
  id: "synonym",
  label: "Synonyms",
  color: "#D4AF37", // Gold
  visible: true,
  provider: "wordnet"
});

registerRelationship({
  id: "antonym",
  label: "Antonyms",
  color: "#8B1E2D", // Muted Red
  visible: true,
  provider: "wordnet"
});

registerRelationship({
  id: "hypernym",
  label: "Hypernyms",
  color: "#9b59b6", // Purple
  visible: false,
  provider: "wordnet"
});

registerRelationship({
  id: "hyponym",
  label: "Hyponyms",
  color: "#e67e22", // Orange
  visible: false,
  provider: "wordnet"
});

export default WordNetProvider;
