import { GraphRelationshipProvider, RelationshipDefinition } from "../types";

const providers: GraphRelationshipProvider[] = [];
const definitions: RelationshipDefinition[] = [];

export function registerProvider(provider: GraphRelationshipProvider) {
  providers.push(provider);
  providers.sort((a, b) => a.priority - b.priority);
}

export function registerRelationship(def: RelationshipDefinition) {
  definitions.push(def);
}

export function getProviders(): GraphRelationshipProvider[] {
  return providers;
}

export function getRelationshipDefinitions(): RelationshipDefinition[] {
  return definitions;
}
