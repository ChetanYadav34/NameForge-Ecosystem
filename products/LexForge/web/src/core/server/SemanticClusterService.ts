import { IndexManager } from './IndexManager';

export interface SemanticClusterRoot {
  word: string;
  weight: number;
  meaning?: string;
  provenance: {
    stage: string;
    sourceToken: string;
    relationship: string;
  };
}

/**
 * SemanticClusterService handles the multi-stage semantic expansion process:
 * Normalize -> Expand -> Ontology -> Cluster -> Reduce
 */
export class SemanticClusterService {
  
  public async generateCluster(prompt: string, industry: string, tone: string): Promise<SemanticClusterRoot[]> {
    const indexManager = IndexManager.getInstance();
    await indexManager.loadIndexes();
    
    const semanticIndex = indexManager.getSemanticIndex();
    const ontologyIndex = indexManager.getOntologyIndex();
    const definitionIndex = indexManager.getDefinitionIndex();

    // Stage 1: Normalize
    const tokens = this.normalizePrompt(prompt);
    
    const clusterMap = new Map<string, SemanticClusterRoot>();

    const addWord = (word: string, weight: number, provenance: SemanticClusterRoot['provenance']) => {
      const existing = clusterMap.get(word);
      if (existing) {
        existing.weight += weight;
        existing.provenance.relationship += ` | ${provenance.relationship}`;
      } else {
        const meaning = definitionIndex[word];
        clusterMap.set(word, { word, weight, meaning, provenance });
      }
    };

    // Stage 2: Expand (Synonyms / Definitions)
    for (const token of tokens) {
      const matches = semanticIndex[token];
      if (matches) {
        matches.forEach(word => {
          addWord(word, 1.0, {
            stage: 'Expand',
            sourceToken: token,
            relationship: 'Semantic match'
          });
        });
      }
    }

    // Stage 3: Ontology (Broader/Narrower concepts and Industry profiling)
    // We can use the industry as a direct ontology token if it exists
    if (industry) {
        const indMatches = ontologyIndex[industry.toLowerCase()];
        if (indMatches) {
            indMatches.forEach(word => {
                addWord(word, 0.8, {
                    stage: 'Ontology',
                    sourceToken: industry,
                    relationship: 'Industry domain'
                });
            });
        }
    }

    if (tone) {
        const toneMatches = semanticIndex[tone.toLowerCase()];
        if (toneMatches) {
            toneMatches.forEach(word => {
                addWord(word, 0.7, {
                    stage: 'Ontology',
                    sourceToken: tone,
                    relationship: 'Tone match'
                });
            });
        }
    }

    // Stage 4: Cluster & Weight
    // The Map already aggregated the weights. Let's convert to an array.
    const cluster = Array.from(clusterMap.values());

    // Stage 5: Reduce
    return this.reduceCluster(cluster);
  }

  private normalizePrompt(prompt: string): string[] {
    const stopWords = new Set(['a', 'an', 'the', 'make', 'create', 'name', 'for', 'my', 'new', 'company', 'brand']);
    return prompt
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 2 && !stopWords.has(token));
  }

  private reduceCluster(cluster: SemanticClusterRoot[], maxRoots = 100): SemanticClusterRoot[] {
    return cluster
      .sort((a, b) => b.weight - a.weight) // Highest weight first
      .slice(0, maxRoots);
  }
}
