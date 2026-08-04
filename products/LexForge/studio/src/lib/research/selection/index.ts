// Types
export * from "./types";

// Engine
export * from "./engine";

// Registries
import { selectionStrategyRegistry } from "./registry";
export { selectionStrategyRegistry };

// Strategies
import {
  BalancedSelectionStrategy,
  CommercialSelectionStrategy,
  InnovationSelectionStrategy,
  MedicalSelectionStrategy,
  FantasySelectionStrategy,
  BrandSelectionStrategy
} from "./strategies";
export * from "./strategies";

// Register default strategies
selectionStrategyRegistry.register(new BalancedSelectionStrategy());
selectionStrategyRegistry.register(new CommercialSelectionStrategy());
selectionStrategyRegistry.register(new InnovationSelectionStrategy());
selectionStrategyRegistry.register(new MedicalSelectionStrategy());
selectionStrategyRegistry.register(new FantasySelectionStrategy());
selectionStrategyRegistry.register(new BrandSelectionStrategy());
