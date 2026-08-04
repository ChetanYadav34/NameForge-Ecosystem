// Types
export * from "./types";

// Engine
export * from "./engine";

// Registry
import { intelligenceAnalyzerRegistry } from "./registry";
export { intelligenceAnalyzerRegistry };

// Analyzers
import { DominanceAnalyzer } from "./analyzers/dominance";
import { CoverageAnalyzer } from "./analyzers/coverage";
import { DiversityAnalyzer } from "./analyzers/diversity";
import { TransitionImportanceAnalyzer } from "./analyzers/transition";
import { MorphologicalImportanceAnalyzer } from "./analyzers/morphological";
import { PhoneticImportanceAnalyzer } from "./analyzers/phonetic";

// Register all analyzers
intelligenceAnalyzerRegistry.register(new DominanceAnalyzer());
intelligenceAnalyzerRegistry.register(new CoverageAnalyzer());
intelligenceAnalyzerRegistry.register(new DiversityAnalyzer());
intelligenceAnalyzerRegistry.register(new TransitionImportanceAnalyzer());
intelligenceAnalyzerRegistry.register(new MorphologicalImportanceAnalyzer());
intelligenceAnalyzerRegistry.register(new PhoneticImportanceAnalyzer());
