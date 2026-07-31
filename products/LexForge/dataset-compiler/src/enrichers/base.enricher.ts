import { TransformResult, PipelineModule, PipelineModuleMetadata } from "../types/index.js";

/**
 * Abstract base class for all semantic enrichers.
 *
 * Enrichers are similar to transformers but conceptually focus on adding
 * external knowledge (semantics, domains, etc.) rather than transforming
 * internal structures.
 *
 * @typeParam TInput - The shape of each input record.
 * @typeParam TOutput - The shape of each output record (must extend TInput).
 */
export abstract class BaseEnricher<TInput, TOutput> implements PipelineModule {
  /** Human-readable name of this enricher. */
  abstract readonly name: string;
  abstract readonly metadata: PipelineModuleMetadata;

  /**
   * Enrich a batch of records.
   *
   * Implementations must NOT mutate the input records.
   * Each output record should be a new object.
   *
   * @param records - The input records to enrich.
   * @returns A Promise or synchronous TransformResult containing enriched records.
   */
  abstract enrich(records: TInput[]): Promise<TransformResult<TOutput>> | TransformResult<TOutput>;
}
