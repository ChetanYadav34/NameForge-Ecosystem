// ============================================================================
// LexForge Dataset Compiler — Base Importer
// ============================================================================
// Abstract base class that all importers must extend.
// Enforces a consistent contract: every importer has a name and an import
// method that returns an ImportResult.
// ============================================================================

import { ImportResult, PipelineModule, PipelineModuleMetadata } from "../types/index.js";

/**
 * Abstract base class for all data importers.
 *
 * Each importer is responsible for streaming one raw data source.
 * This ensures multi-gigabyte files do not cause V8 memory exhaustion.
 *
 * @typeParam T - The shape of each imported record.
 */
export abstract class BaseImporter<T> implements PipelineModule {
  /** Human-readable name of the data source this importer handles. */
  abstract readonly name: string;
  abstract readonly metadata: PipelineModuleMetadata;

  /**
   * Generates records progressively.
   *
   * @returns An AsyncGenerator yielding records one by one.
   */
  abstract import(): AsyncGenerator<T, void, unknown>;
}
