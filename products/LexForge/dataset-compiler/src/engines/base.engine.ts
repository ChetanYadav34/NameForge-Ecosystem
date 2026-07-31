import { PipelineModule, TransformResult } from "../types/index.js";

/**
 * Base class for all LexForge engines.
 * 
 * Engines are responsible for clustering, grouping, or building cross-record relationships.
 * They consume enriched pipeline records and emit transformed models with the new relationships.
 */
export abstract class BaseEngine<TInput, TOutput> implements PipelineModule {
  abstract get metadata(): PipelineModule["metadata"];

  /**
   * Executes the engine logic across the entire dataset.
   * 
   * @param records The full dataset of records from the previous stage.
   * @returns A promise resolving to the engine output result.
   */
  abstract execute(records: TInput[]): Promise<TransformResult<TOutput>>;
}
