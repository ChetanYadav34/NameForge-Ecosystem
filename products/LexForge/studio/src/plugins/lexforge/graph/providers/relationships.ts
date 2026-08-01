import { GraphRelationshipProvider } from "../registry/types";

export class WordFamilyProvider implements GraphRelationshipProvider {
  id = "provider.wordFamily";
  name = "Word Family";
  
  async resolveRelationships(nodeId: string, context: any) {
    // Stub
    return [];
  }
}

export class SynonymProvider implements GraphRelationshipProvider {
  id = "provider.synonym";
  name = "Synonym";
  
  async resolveRelationships(nodeId: string, context: any) {
    return [];
  }
}

export class AntonymProvider implements GraphRelationshipProvider {
  id = "provider.antonym";
  name = "Antonym";
  
  async resolveRelationships(nodeId: string, context: any) {
    return [];
  }
}

export class HypernymProvider implements GraphRelationshipProvider {
  id = "provider.hypernym";
  name = "Hypernym";
  
  async resolveRelationships(nodeId: string, context: any) {
    return [];
  }
}

export class HyponymProvider implements GraphRelationshipProvider {
  id = "provider.hyponym";
  name = "Hyponym";
  
  async resolveRelationships(nodeId: string, context: any) {
    return [];
  }
}

export class DerivationProvider implements GraphRelationshipProvider {
  id = "provider.derivation";
  name = "Derivation";
  
  async resolveRelationships(nodeId: string, context: any) {
    return [];
  }
}

export class InflectionProvider implements GraphRelationshipProvider {
  id = "provider.inflection";
  name = "Inflection";
  
  async resolveRelationships(nodeId: string, context: any) {
    return [];
  }
}
