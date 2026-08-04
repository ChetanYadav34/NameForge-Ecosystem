// Types
export * from "./types";

// Engine
export * from "./engine";
export * from "./builders";

// Registry
import { strategyRegistry } from "./registry";
export { strategyRegistry };

// Strategies
import { BrandStrategy } from "./strategies/brand";
import { FantasyStrategy } from "./strategies/fantasy";
import { SciFiStrategy } from "./strategies/scifi";
import { MedicalStrategy } from "./strategies/medical";
import { NatureStrategy } from "./strategies/nature";
import { PersonNameStrategy } from "./strategies/person";
import { ProductStrategy } from "./strategies/product";
import { CompanyStrategy } from "./strategies/company";

// Register default strategies
strategyRegistry.register(new BrandStrategy());
strategyRegistry.register(new FantasyStrategy());
strategyRegistry.register(new SciFiStrategy());
strategyRegistry.register(new MedicalStrategy());
strategyRegistry.register(new NatureStrategy());
strategyRegistry.register(new PersonNameStrategy());
strategyRegistry.register(new ProductStrategy());
strategyRegistry.register(new CompanyStrategy());
