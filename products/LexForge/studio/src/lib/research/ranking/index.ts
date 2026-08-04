// Types
export * from "./types";

// Engine
export * from "./engine";

// Registry
import { rankingStrategyRegistry } from "./registry";
export { rankingStrategyRegistry };

// Strategies
import {
  BalancedRankingStrategy,
  InnovationRankingStrategy,
  CommercialRankingStrategy,
  MedicalRankingStrategy,
  FantasyRankingStrategy,
  SpeedRankingStrategy
} from "./strategies";
export * from "./strategies";

// Register default strategies
rankingStrategyRegistry.register(new BalancedRankingStrategy());
rankingStrategyRegistry.register(new InnovationRankingStrategy());
rankingStrategyRegistry.register(new CommercialRankingStrategy());
rankingStrategyRegistry.register(new MedicalRankingStrategy());
rankingStrategyRegistry.register(new FantasyRankingStrategy());
rankingStrategyRegistry.register(new SpeedRankingStrategy());
