export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  defaultValue: boolean;
  enabled: boolean;
  experimental?: boolean;
}

class FeatureRegistry {
  private features = new Map<string, FeatureFlag>();

  public register(feature: Omit<FeatureFlag, 'enabled'> & { enabled?: boolean }): void {
    if (this.features.has(feature.id)) {
      console.warn(`[FeatureRegistry] Feature ${feature.id} is already registered.`);
    }
    this.features.set(feature.id, {
      ...feature,
      enabled: feature.enabled ?? feature.defaultValue
    });
  }

  public isEnabled(id: string): boolean {
    const feature = this.features.get(id);
    if (!feature) {
      console.warn(`[FeatureRegistry] Checking unknown feature flag: ${id}`);
      return false;
    }
    return feature.enabled;
  }

  public setEnabled(id: string, enabled: boolean): void {
    const feature = this.features.get(id);
    if (feature) {
      feature.enabled = enabled;
      this.features.set(id, feature);
    }
  }

  public getAll(): FeatureFlag[] {
    return Array.from(this.features.values());
  }
}

export const coreFeatures = new FeatureRegistry();
