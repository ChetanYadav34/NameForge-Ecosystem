import { KnowledgePackageManifest, KnowledgePackage } from "../types/knowledge-package.js";
import { logger } from "../utils/logger.js";

export class PackageRegistry {
  private static packages: Map<string, KnowledgePackage> = new Map();

  static register(pkg: KnowledgePackage): void {
    if (this.packages.has(pkg.manifest.id)) {
      throw new Error(`Knowledge package with ID ${pkg.manifest.id} is already registered.`);
    }
    this.packages.set(pkg.manifest.id, pkg);
    logger.info(`Registered Knowledge Package: ${pkg.manifest.id}@${pkg.manifest.version}`);
  }

  static get(id: string): KnowledgePackage | undefined {
    return this.packages.get(id);
  }

  static getAll(): KnowledgePackage[] {
    return Array.from(this.packages.values());
  }

  static validateAll(): void {
    const allIds = new Set(this.packages.keys());
    const validated = new Set<string>();

    const checkDependencies = (id: string, path: Set<string>) => {
      if (validated.has(id)) return;
      if (path.has(id)) {
        throw new Error(`Circular dependency detected in knowledge packages: ${Array.from(path).join(' -> ')} -> ${id}`);
      }
      
      const pkg = this.packages.get(id);
      if (!pkg) {
        throw new Error(`Knowledge Package ${id} not found.`);
      }

      path.add(id);

      for (const dep of pkg.manifest.dependencies) {
        if (!allIds.has(dep)) {
          throw new Error(`Knowledge Package ${id} depends on missing package: ${dep}`);
        }
        checkDependencies(dep, path);
      }

      path.delete(id);
      validated.add(id);
    };

    for (const id of allIds) {
      checkDependencies(id, new Set());
    }

    logger.info(`Validated ${this.packages.size} Knowledge Packages and their dependency graph.`);
  }

  static buildExecutionOrder(): KnowledgePackage[] {
    this.validateAll(); // Ensure graph is valid

    const visited = new Set<string>();
    const order: KnowledgePackage[] = [];

    const visit = (id: string) => {
      if (visited.has(id)) return;
      const pkg = this.packages.get(id)!;
      for (const dep of pkg.manifest.dependencies) {
        visit(dep);
      }
      visited.add(id);
      order.push(pkg);
    };

    for (const id of this.packages.keys()) {
      visit(id);
    }

    return order;
  }
}
