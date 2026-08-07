import { GenerationContext } from '../context/GenerationContext';
import { SemanticClusterRoot } from '../../server/SemanticClusterService';

export class SemanticProvider {
  
  public async getCluster(context: GenerationContext): Promise<SemanticClusterRoot[]> {
    try {
      const url = new URL('/api/lexicon/search', window.location.origin);
      url.searchParams.append('prompt', context.parsedIntent);
      url.searchParams.append('industry', context.industry);
      url.searchParams.append('tone', context.tone);
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to fetch semantic cluster: ${response.statusText}`);
      }
      
      const json = await response.json();
      return json.cluster || [];
    } catch (e) {
      console.error('[SemanticProvider] Error:', e);
      return [];
    }
  }
}
