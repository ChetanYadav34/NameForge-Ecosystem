import fs from "node:fs";
import { ResourceDefinition, ResourceState } from "../types/index.js";
import { logger } from "../utils/logger.js";

/**
 * Registry for external datasets (resources) consumed by LexForge.
 */
export class ResourceRegistry {
  private static resources: Map<string, ResourceDefinition> = new Map();
  private static states: Map<string, ResourceState> = new Map();

  /**
   * Clears the registry (useful for testing).
   */
  static clear(): void {
    this.resources.clear();
    this.states.clear();
  }

  /**
   * Registers a new resource without validating its filesystem path.
   */
  static register(resource: ResourceDefinition): void {
    if (this.resources.has(resource.id)) {
      throw new Error(`Resource with ID '${resource.id}' is already registered.`);
    }

    // Check for duplicate paths
    for (const existing of this.resources.values()) {
      if (existing.path === resource.path) {
        throw new Error(
          `Resource path collision: '${resource.id}' and '${existing.id}' both point to '${resource.path}'.`
        );
      }
    }

    this.resources.set(resource.id, resource);
    this.states.set(resource.id, ResourceState.REGISTERED);
  }

  /**
   * Validates all registered resources by checking if their paths exist on disk.
   */
  static validateAll(): void {
    for (const [id, resource] of this.resources.entries()) {
      try {
        if (!fs.existsSync(resource.path)) {
          this.states.set(id, ResourceState.FAILED);
          logger.warn(`Resource path does not exist for '${id}': ${resource.path}`);
          continue;
        }
        this.states.set(id, ResourceState.VALIDATED);
      } catch (error: any) {
        logger.error(`Resource validation failed for '${id}': ${error.message}`);
        this.states.set(id, ResourceState.FAILED);
      }
    }
  }

  /**
   * Marks a resource as successfully loaded.
   */
  static markLoaded(id: string): void {
    if (!this.resources.has(id)) {
      throw new Error(`Resource not found: '${id}'`);
    }
    this.states.set(id, ResourceState.LOADED);
  }

  /**
   * Retrieves a resource definition by ID. Supports version selection (e.g. 'wordnet@3.1') in the future.
   */
  static get(id: string): ResourceDefinition {
    // For now, version selection is stubbed. ID is exact match.
    const resource = this.resources.get(id);
    if (!resource) {
      throw new Error(`Resource '${id}' is not registered.`);
    }
    return resource;
  }

  /**
   * Retrieves the current state of a resource.
   */
  static getState(id: string): ResourceState {
    const state = this.states.get(id);
    if (!state) {
      throw new Error(`Resource '${id}' is not registered.`);
    }
    return state;
  }

  /**
   * Returns all registered resources.
   */
  static getAll(): ResourceDefinition[] {
    return Array.from(this.resources.values());
  }
}
