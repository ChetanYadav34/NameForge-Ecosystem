// Types
export * from "./types";

// Engine
export * from "./engine";

// Registry
import { dnaAnalyzerRegistry } from "./registry";
export { dnaAnalyzerRegistry };

// Utilities
export * from "./utils/pattern";

// Analyzers
import { OrthographicAnalyzer } from "./analyzers/orthographic";
import { PhoneticAnalyzer } from "./analyzers/phonetic";
import { MorphologicalAnalyzer } from "./analyzers/morphological";
import { StructuralAnalyzer } from "./analyzers/structural";
import { FrequencyAnalyzer } from "./analyzers/frequency";
import { SemanticAnalyzer } from "./analyzers/semantic";
import { TransitionAnalyzer } from "./analyzers/transition";

// Register all analyzers
dnaAnalyzerRegistry.register(new OrthographicAnalyzer());
dnaAnalyzerRegistry.register(new PhoneticAnalyzer());
dnaAnalyzerRegistry.register(new MorphologicalAnalyzer());
dnaAnalyzerRegistry.register(new StructuralAnalyzer());
dnaAnalyzerRegistry.register(new FrequencyAnalyzer());
dnaAnalyzerRegistry.register(new SemanticAnalyzer());
dnaAnalyzerRegistry.register(new TransitionAnalyzer());
