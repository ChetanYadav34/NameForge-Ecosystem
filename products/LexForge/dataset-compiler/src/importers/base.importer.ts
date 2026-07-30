// ============================================================================
// LexForge Dataset Compiler — Base Importer
// ============================================================================
// Abstract base class that all importers must extend.
// Enforces a consistent contract: every importer has a name and an import
// method that returns an ImportResult.
// ============================================================================

import { ImportResult } from "../types/index.js";

/**
 * Abstract base class for all data importers.
 *
 * Each importer is responsible for reading one raw data source and
 * converting it into a structured ImportResult.
 *
 * To add a new data source, create a new class extending BaseImporter
 * without modifying any existing code.
 *
 * @typeParam T - The shape of each imported record.
 */
export abstract class BaseImporter<T> {
  /** Human-readable name of the data source this importer handles. */
  abstract readonly name: string;

  /**
   * Import data from the specified file path.
   *
   * @param filePath - Absolute path to the raw data file.
   * @returns An ImportResult containing the parsed data, record count, and any errors.
   */
  abstract import(filePath: string): Promise<ImportResult<T>>;
}
