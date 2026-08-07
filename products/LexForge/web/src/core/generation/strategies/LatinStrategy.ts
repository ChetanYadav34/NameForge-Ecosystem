import { IGenerationStrategy, CandidateWord } from './IGenerationStrategy';
import { GenerationContext } from '../context/GenerationContext';
import { SemanticClusterRoot } from '../../server/SemanticClusterService';
import { Registry } from '../providers/ProviderRegistry';
import { DictionaryProvider } from '../providers/DictionaryProvider';

export class LatinStrategy implements IGenerationStrategy {
  name = 'LatinStrategy';
  weight = 1.0;

  public async generate(context: GenerationContext, cluster: SemanticClusterRoot[], limit: number): Promise<CandidateWord[]> {
    const dictionary = Registry.get<DictionaryProvider>('DictionaryProvider');
    const roots = dictionary.getLatinRoots();
    
    const candidates: CandidateWord[] = [];
    
    // Instead of randomly picking from static roots, use semantic cluster roots if available
    const activeRoots = cluster.length > 0 ? cluster : roots.map((r: any) => ({ word: r.root, weight: 1, provenance: { stage: 'Fallback', sourceToken: '', relationship: '' } }));

    for (let i = 0; i < limit && i < activeRoots.length; i++) {
      const sourceRoot = activeRoots[i];
      const rootStr = sourceRoot.word;
      
      // Smarter pseudo-latin morphing
      let prefix = rootStr;
      if (prefix.length > 6) {
        prefix = prefix.substring(0, Math.floor(prefix.length * 0.7)); // Trim long roots
      }
      
      const lastChar = prefix.slice(-1);
      const isVowel = ['a','e','i','o','u'].includes(lastChar);
      
      let suffix = '';
      if (isVowel) {
        const vSuffixes = ['x', 's', 'm', 'n', 'ra', 'lis'];
        suffix = vSuffixes[Math.floor(Math.random() * vSuffixes.length)];
      } else {
        const cSuffixes = ['ia', 'us', 'um', 'ex', 'is', 'a', 'io'];
        suffix = cSuffixes[Math.floor(Math.random() * cSuffixes.length)];
      }

      candidates.push({
        word: prefix + suffix,
        provenance: {
          strategyName: this.name,
          sourceRoots: [sourceRoot],
          rulesApplied: ['latin_suffix_' + suffix]
        }
      });
    }
    
    return candidates;
  }
}
