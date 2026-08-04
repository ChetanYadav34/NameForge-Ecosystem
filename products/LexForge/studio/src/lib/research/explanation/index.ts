// Types
export * from "./types";

// Engine
export * from "./engine";

// Registries
import { explanationBuilderRegistry } from "./registry";
export { explanationBuilderRegistry };

// Builders
import {
  GenerationExplanationBuilder,
  EvaluationExplanationBuilder,
  FilteringExplanationBuilder,
  RankingExplanationBuilder,
  DiversificationExplanationBuilder,
  SelectionExplanationBuilder,
  TraceabilityExplanationBuilder
} from "./builders";
export * from "./builders";

// Register default builders
explanationBuilderRegistry.register(new GenerationExplanationBuilder());
explanationBuilderRegistry.register(new EvaluationExplanationBuilder());
explanationBuilderRegistry.register(new FilteringExplanationBuilder());
explanationBuilderRegistry.register(new RankingExplanationBuilder());
explanationBuilderRegistry.register(new DiversificationExplanationBuilder());
explanationBuilderRegistry.register(new SelectionExplanationBuilder());
explanationBuilderRegistry.register(new TraceabilityExplanationBuilder());
