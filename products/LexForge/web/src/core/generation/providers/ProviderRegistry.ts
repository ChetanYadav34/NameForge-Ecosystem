export interface IProvider {
  initialize(): Promise<void>;
  name: string;
}

export class ProviderRegistry {
  private providers: Map<string, IProvider> = new Map();

  public register(provider: IProvider) {
    this.providers.set(provider.name, provider);
  }

  public get<T extends IProvider>(name: string): T {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider ${name} not found in registry.`);
    }
    return provider as T;
  }

  public async initializeAll(): Promise<void> {
    for (const provider of Array.from(this.providers.values())) {
      await provider.initialize();
    }
  }
}

// Singleton instance
export const Registry = new ProviderRegistry();
