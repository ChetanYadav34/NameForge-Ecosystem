// Types
export * from "./types";

// Engine
export * from "./engine";

// Registries
import { diversificationStrategyRegistry, similarityAnalyzerRegistry } from "./registry";
export { diversificationStrategyRegistry, similarityAnalyzerRegistry };

// Analyzers
import {
  OrthographicSimilarityAnalyzer,
  PhoneticSimilarityAnalyzer,
  MorphologicalSimilarityAnalyzer,
  StructuralSimilarityAnalyzer,
  TransitionSimilarityAnalyzer,
  ClusterSimilarityAnalyzer
} from "./analyzers";
export * from "./analyzers";

// Strategies
import {
  BalancedDiversificationStrategy,
  CommercialDiversificationStrategy,
  BrandDiversificationStrategy,
  MedicalDiversificationStrategy,
  FantasyDiversificationStrategy,
  InnovationDiversificationStrategy
} from "./strategies";
export * from "./strategies";

// Register default analyzers
similarityAnalyzerRegistry.register(new OrthographicSimilarityAnalyzer());
similarityAnalyzerRegistry.register(new PhoneticSimilarityAnalyzer());
similarityAnalyzerRegistry.register(new MorphologicalSimilarityAnalyzer());
similarityAnalyzerRegistry.register(new StructuralSimilarityAnalyzer());
similarityAnalyzerRegistry.register(new TransitionSimilarityAnalyzer());
similarityAnalyzerRegistry.register(new ClusterSimilarityAnalyzer());

// Register default strategies
diversificationStrategyRegistry.register(new BalancedDiversificationStrategy());
diversificationStrategyRegistry.register(new CommercialDiversificationStrategy());
diversificationStrategyRegistry.register(new BrandDiversificationStrategy());
diversificationStrategyRegistry.register(new MedicalDiversificationStrategy());
diversificationStrategyRegistry.register(new FantasyDiversificationStrategy());
diversificationStrategyRegistry.register(new InnovationDiversificationStrategy());
