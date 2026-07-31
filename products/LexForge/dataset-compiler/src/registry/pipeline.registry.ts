import { PipelineModule } from "../types/index.js";
import { FeatureRegistry } from "./feature.registry.js";

type AnyModule = PipelineModule;

export class PipelineRegistry {
  private static importers: AnyModule[] = [];
  private static transformers: AnyModule[] = [];
  private static enrichers: AnyModule[] = [];
  private static engines: AnyModule[] = [];
  private static validators: AnyModule[] = [];
  private static builders: AnyModule[] = [];
  private static exporters: AnyModule[] = [];

  private static allModules = new Map<string, AnyModule>();

  private static registerModule(module: AnyModule, collection: AnyModule[]): void {
    const meta = module.metadata;

    if (this.allModules.has(meta.id)) {
      throw new Error(`Pipeline module with ID '${meta.id}' is already registered.`);
    }

    // Verify requiresFeatures exist in FeatureRegistry
    for (const reqFeat of meta.requiresFeatures) {
      if (!FeatureRegistry.getById(reqFeat)) {
        throw new Error(`Module '${meta.id}' requires feature '${reqFeat}', which is not registered.`);
      }
    }

    this.allModules.set(meta.id, module);
    collection.push(module);
    
    // Sort the collection based on priority (lower number = higher priority = executed first)
    collection.sort((a, b) => a.metadata.priority - b.metadata.priority);
  }

  static registerImporter<T extends AnyModule>(importer: T): void {
    this.registerModule(importer, this.importers);
  }

  static registerTransformer<T extends AnyModule>(transformer: T): void {
    this.registerModule(transformer, this.transformers);
  }

  static registerEnricher<T extends AnyModule>(enricher: T): void {
    this.registerModule(enricher, this.enrichers);
  }

  static registerEngine<T extends AnyModule>(engine: T): void {
    this.registerModule(engine, this.engines);
  }

  static registerValidator<T extends AnyModule>(validator: T): void {
    this.registerModule(validator, this.validators);
  }

  static registerBuilder<T extends AnyModule>(builder: T): void {
    this.registerModule(builder, this.builders);
  }

  static registerExporter<T extends AnyModule>(exporter: T): void {
    this.registerModule(exporter, this.exporters);
  }

  // --- Getters ---

  static getImporters<T extends AnyModule>(): T[] {
    return this.importers as T[];
  }

  static getTransformers<T extends AnyModule>(): T[] {
    return this.transformers as T[];
  }

  static getEnrichers<T extends AnyModule>(): T[] {
    return this.enrichers as T[];
  }

  static getEngines<T extends AnyModule>(): T[] {
    return this.engines as T[];
  }

  static getValidators<T extends AnyModule>(): T[] {
    return this.validators as T[];
  }

  static getBuilders<T extends AnyModule>(): T[] {
    return this.builders as T[];
  }

  static getExporters<T extends AnyModule>(): T[] {
    return this.exporters as T[];
  }

  static getAllModules(): AnyModule[] {
    return Array.from(this.allModules.values());
  }

  // --- Validation ---

  /**
   * Validates the entire pipeline dependency graph.
   * Checks for missing module dependencies and circular dependencies.
   */
  static validateDependencies(): void {
    // 1. Missing module dependencies
    for (const module of this.allModules.values()) {
      for (const reqMod of module.metadata.requiresModules) {
        if (!this.allModules.has(reqMod)) {
          throw new Error(`Module '${module.metadata.id}' requires module '${reqMod}', which is not registered.`);
        }
      }
    }

    // 2. Circular dependencies
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (moduleId: string) => {
      visited.add(moduleId);
      recursionStack.add(moduleId);

      const module = this.allModules.get(moduleId);
      if (module) {
        for (const reqMod of module.metadata.requiresModules) {
          if (!visited.has(reqMod)) {
            dfs(reqMod);
          } else if (recursionStack.has(reqMod)) {
            throw new Error(`Circular dependency detected involving module '${moduleId}' and '${reqMod}'.`);
          }
        }
      }

      recursionStack.delete(moduleId);
    };

    for (const moduleId of this.allModules.keys()) {
      if (!visited.has(moduleId)) {
        dfs(moduleId);
      }
    }
  }

  /**
   * Generates a Mermaid.js dependency graph diagram.
   */
  static generateDependencyGraph(): string {
    const lines = ["graph TD;"];
    for (const module of this.allModules.values()) {
      for (const req of module.metadata.requiresModules) {
        lines.push(`  ${req}-->${module.metadata.id};`);
      }
    }
    return lines.join("\n");
  }

  /**
   * Clears the registry (useful for testing).
   */
  static clear(): void {
    this.importers = [];
    this.transformers = [];
    this.enrichers = [];
    this.validators = [];
    this.builders = [];
    this.exporters = [];
    this.allModules.clear();
  }
}
