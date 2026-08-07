import { CompilerPass } from "../types/compiler.js";

/**
 * Manages the registration and resolution of compiler passes.
 * Validates the dependency graph and determines execution order.
 */
export class PassRegistry {
  private static passes: Map<string, CompilerPass> = new Map();

  /**
   * Registers a new compiler pass.
   */
  static register(pass: CompilerPass): void {
    if (this.passes.has(pass.metadata.id)) {
      throw new Error(`Compiler pass with id '${pass.metadata.id}' is already registered.`);
    }
    this.passes.set(pass.metadata.id, pass);
  }

  /**
   * Gets a pass by ID.
   */
  static get(id: string): CompilerPass | undefined {
    return this.passes.get(id);
  }

  /**
   * Gets all registered passes.
   */
  static getAll(): CompilerPass[] {
    return Array.from(this.passes.values());
  }

  /**
   * Validates the dependency graph and returns a chronologically sorted execution plan.
   * Throws if there are missing dependencies or circular dependencies.
   */
  static buildExecutionPlan(): CompilerPass[] {
    const sorted: CompilerPass[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (passId: string) => {
      if (visiting.has(passId)) {
        throw new Error(`Circular dependency detected involving pass '${passId}'.`);
      }
      if (visited.has(passId)) {
        return;
      }

      visiting.add(passId);

      const pass = this.passes.get(passId);
      if (!pass) {
        throw new Error(`Missing dependency: Pass '${passId}' is required but not registered.`);
      }

      for (const dep of pass.metadata.dependencies) {
        visit(dep);
      }

      visiting.delete(passId);
      visited.add(passId);
      sorted.push(pass);
    };

    // Make sure we visit all passes
    for (const passId of this.passes.keys()) {
      visit(passId);
    }

    return sorted;
  }

  /**
   * Clears the registry (useful for testing).
   */
  static clear(): void {
    this.passes.clear();
  }
}
