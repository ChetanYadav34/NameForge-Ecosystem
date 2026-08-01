import { DatasetRepository } from "../dataset/repository";
import { getProviders } from "./providers/registry";
import { ExpandRequest, GraphEdge, GraphNode, GraphRelationship, GraphView } from "./types";
import { randomUUID } from "crypto";

export class GraphBuilder {
  static async buildNeighborhood(request: ExpandRequest): Promise<GraphView> {
    const wordRecord = await DatasetRepository.findWord(request.id);
    if (!wordRecord) {
      throw new Error(`Word not found: ${request.id}`);
    }

    const nodes = new Map<string, GraphNode>();
    const edges: GraphEdge[] = [];

    // Add root node
    nodes.set(wordRecord.word, {
      id: wordRecord.word,
      label: wordRecord.word,
      type: "word",
      metadata: { partOfSpeech: wordRecord.partOfSpeech }
    });

    const providers = getProviders();
    const relationships: GraphRelationship[] = [];

    for (const provider of providers) {
      const rels = await provider.build(wordRecord);
      relationships.push(...rels);
    }

    // Process relationships into nodes and edges
    for (const rel of relationships) {
      if (request.relationships && request.relationships.length > 0) {
        if (!request.relationships.includes(rel.relationship)) continue;
      }

      // Add target node if it doesn't exist.
      // We assume source is always the root node for depth 1.
      if (!nodes.has(rel.target)) {
        nodes.set(rel.target, {
          id: rel.target,
          label: rel.target,
          // If relationship is family, type is family. Otherwise word.
          type: rel.relationship === "family" ? "family" : "word"
        });
      }

      edges.push({
        id: randomUUID(),
        source: rel.source,
        target: rel.target,
        relationship: rel.relationship,
        weight: rel.weight || 1,
        direction: rel.bidirectional ? "undirected" : "directed"
      });
    }

    const nodeList = Array.from(nodes.values());
    
    // Calculate simple stats
    const stats = {
      nodeCount: nodeList.length,
      edgeCount: edges.length,
      connectedComponents: 1, // depth 1 is always connected
      averageDegree: nodeList.length > 0 ? (edges.length * 2) / nodeList.length : 0,
      generatedAt: new Date().toISOString()
    };

    return {
      nodes: nodeList,
      edges,
      statistics: stats
    };
  }
}
