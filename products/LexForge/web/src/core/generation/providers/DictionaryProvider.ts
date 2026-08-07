import { IProvider } from './ProviderRegistry';

export interface RootEntry {
  root: string;
  meaning: string;
  origin: string;
}

export class DictionaryProvider implements IProvider {
  name = 'DictionaryProvider';
  
  private latinRoots: RootEntry[] = [];
  private greekRoots: RootEntry[] = [];
  private sanskritRoots: RootEntry[] = [];
  private meaningMap: Map<string, string> = new Map();

  public async initialize(): Promise<void> {
    // In a real app, this might fetch from an API or read from the filesystem dynamically
    // For now, we statically import the JSON data representing our datasets.
    
    // We use dynamic imports to simulate async loading of datasets
    this.latinRoots = (await import('../../../data/latin/v1/roots.json')).default as RootEntry[];
    this.greekRoots = (await import('../../../data/greek/v1/roots.json')).default as RootEntry[];
    this.sanskritRoots = (await import('../../../data/sanskrit/v1/roots.json')).default as RootEntry[];

    const populateMap = (roots: RootEntry[]) => {
      roots.forEach(r => this.meaningMap.set(r.root.toLowerCase(), r.meaning));
    };
    
    populateMap(this.latinRoots);
    populateMap(this.greekRoots);
    populateMap(this.sanskritRoots);
  }

  public lookupMeaning(word: string): string | undefined {
    return this.meaningMap.get(word.toLowerCase());
  }

  public getLatinRoots(): RootEntry[] {
    return this.latinRoots;
  }

  public getGreekRoots(): RootEntry[] {
    return this.greekRoots;
  }

  public getSanskritRoots(): RootEntry[] {
    return this.sanskritRoots;
  }
}
