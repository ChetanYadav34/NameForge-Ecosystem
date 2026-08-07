import { IProvider } from './ProviderRegistry';

export class PsychologyProvider implements IProvider {
  name = 'PsychologyProvider';

  public async initialize(): Promise<void> {
    // Simulated load
  }

  public getEmotionVector(word: string): any {
    return { trust: 0.8, innovation: 0.9, energy: 0.7, luxury: 0.6, playfulness: 0.4 };
  }
}

export class RankingProvider implements IProvider {
  name = 'RankingProvider';

  public async initialize(): Promise<void> {}

  public getWeightsForIndustry(industry: string): any {
    return { semantic: 1.2, brandability: 1.5 };
  }
}
