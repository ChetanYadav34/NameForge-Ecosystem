export interface FeatureManifest {
  name: string;
  id: string;
  routes: string[];
}

export class FeatureRegistry {
  private static features: Map<string, FeatureManifest> = new Map();

  static register(manifest: FeatureManifest) {
    if (this.features.has(manifest.id)) {
      console.warn(`Feature ${manifest.id} is already registered.`);
      return;
    }
    this.features.set(manifest.id, manifest);
  }

  static getFeature(id: string): FeatureManifest | undefined {
    return this.features.get(id);
  }

  static getAllFeatures(): FeatureManifest[] {
    return Array.from(this.features.values());
  }
}
