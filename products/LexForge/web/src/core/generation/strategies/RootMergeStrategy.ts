import { IGenerationStrategy, CandidateWord } from './IGenerationStrategy';
import { GenerationContext } from '../context/GenerationContext';
import { SemanticClusterRoot } from '../../server/SemanticClusterService';
import { Registry } from '../providers/ProviderRegistry';
import { DictionaryProvider } from '../providers/DictionaryProvider';

export class RootMergeStrategy implements IGenerationStrategy {
  name = 'RootMergeStrategy';
  weight = 1.2;

  public async generate(context: GenerationContext, cluster: SemanticClusterRoot[], limit: number): Promise<CandidateWord[]> {
    const dictionary = Registry.get<DictionaryProvider>('DictionaryProvider');
    const greek = dictionary.getGreekRoots();
    
    const candidates: CandidateWord[] = [];
    
    const activeRoots = cluster.length > 0 ? cluster : greek.map((r: any) => ({ word: r.root, weight: 1, provenance: { stage: 'Fallback', sourceToken: '', relationship: '' } }));

    for (let i = 0; i < limit && i < activeRoots.length - 1; i++) {
      const root1 = activeRoots[i];
      const root2 = activeRoots[i+1];
      
      const w1 = root1.word;
      const w2 = root2.word;
      
      // Smarter merge: Keep first half of w1 and second half of w2
      const part1 = w1.substring(0, Math.ceil(w1.length / 2) + 1);
      const part2 = w2.substring(Math.floor(w2.length / 2));
      
      let merged = part1 + part2;
      
      // Deduplicate double letters at the boundary (simple phonetic smoothing)
      merged = merged.replace(/([a-z])\1+/g, '$1');

      candidates.push({
        word: merged,
        provenance: {
          strategyName: this.name,
          sourceRoots: [root1, root2],
          rulesApplied: ['smart_merge']
        }
      });
    }
    
    return candidates;
  }
}
