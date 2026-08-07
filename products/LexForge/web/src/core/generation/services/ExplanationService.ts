import { RankedCandidate } from './RankingEngine';
import { Registry } from '../providers/ProviderRegistry';
import { DictionaryProvider } from '../providers/DictionaryProvider';

export interface ExplainedCandidate extends RankedCandidate {
  explanations: {
    meaning: string;
    rootBreakdown: string;
    linguisticReasoning: string;
    psychologicalReasoning: string;
    brandabilityExplanation: string;
  };
}

export class ExplanationService {
  public explain(candidates: RankedCandidate[]): ExplainedCandidate[] {
    const dictionary = Registry.get<DictionaryProvider>('DictionaryProvider');
    
    return candidates.map(c => {
      const sourceRoots = c.provenance?.sourceRoots || [];
      const sourceWords = sourceRoots.map(r => r.word) || ['Unknown'];
      
      let psychologicalReasoning = 'Evokes a sense of trust and innovation.';
      let meaningStr = `Derived from ${sourceWords.join(' + ')}`;
      
      if (sourceWords.length > 0 && sourceWords[0] !== 'Unknown') {
        const concepts = sourceWords.slice(0, 2).join(' and ');
        psychologicalReasoning = `Evokes a sense of ${concepts}.`;
        
        // Try to fetch real meanings from SemanticClusterRoot directly, or fallback to DictionaryProvider
        const meanings = sourceRoots.map(r => {
            const def = r.meaning || dictionary.lookupMeaning(r.word);
            return def ? `"${def.replace(/\.$/, '')}"` : r.word;
        });
        
        if (meanings.some(m => !sourceWords.includes(m))) {
            meaningStr = `Means: ${meanings.join(' and ')}.`;
        }
      }

      return {
        ...c,
        explanations: {
          meaning: meaningStr,
          rootBreakdown: `Roots: ${sourceWords.join(', ')}`,
          linguisticReasoning: 'Flows naturally with balanced consonants.',
          psychologicalReasoning: psychologicalReasoning,
          brandabilityExplanation: 'Highly memorable and visually balanced.'
        }
      };
    });
  }
}
