// ============================================================================
// LexForge Dataset Compiler — Base Transformer
// ============================================================================
// Abstract base class that all transformers must extend.
// Enforces a consistent contract for data enrichment stages.
//
// Transformers sit between the merger and validator in the pipeline.
// Each transformer takes records in and produces enriched records out
// without mutating the input.
//
// Future transformers:
//   • IPA → Phonemes
//   • IPA → Syllables
//   • Word → Semantic Categories
// ============================================================================

import { TransformResult, PipelineModule, PipelineModuleMetadata } from "../types/index.js";

/**
 * Abstract base class for all data transformers.
 *
 * Each transformer is responsible for enriching records with one specific
 * type of derived data. Transformers receive an array of input records
 * and return a TransformResult containing new, enriched records.
 *
 * To add a new transformation stage, create a new class extending
 * BaseTransformer without modifying any existing code.
 *
 * @typeParam TInput - The shape of each input record.
 * @typeParam TOutput - The shape of each output record (must extend TInput).
 */
export abstract class BaseTransformer<TInput, TOutput> implements PipelineModule {
  /** Human-readable name of this transformer. */
  abstract readonly name: string;
  abstract readonly metadata: PipelineModuleMetadata;

  /**
   * Transform a batch of records, enriching each with derived data.
   *
   * Implementations must NOT mutate the input records.
   * Each output record should be a new object.
   *
   * @param records - The input records to transform.
   * @returns A TransformResult containing enriched records, counts, and warnings.
   */
  abstract transform(records: TInput[]): TransformResult<TOutput>;
}
