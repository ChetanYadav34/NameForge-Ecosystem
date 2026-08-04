// Types
export * from "./types";

// Engine
export * from "./engine";

// Registry
import { blueprintAnalyzerRegistry } from "./registry";
export { blueprintAnalyzerRegistry };

// Analyzers
import { PatternClusterAnalyzer } from "./analyzers/cluster";
import { PatternRelationshipAnalyzer } from "./analyzers/relationship";
import { StructureAnalyzer } from "./analyzers/structure";
import { FlowAnalyzer } from "./analyzers/flow";
import { MorphologyRuleAnalyzer } from "./analyzers/morphology";
import { TransitionRuleAnalyzer } from "./analyzers/transition";
import { ConstraintAnalyzer } from "./analyzers/constraint";
import { RecommendationAnalyzer } from "./analyzers/recommendation";

// Register all analyzers
blueprintAnalyzerRegistry.register(new PatternClusterAnalyzer());
blueprintAnalyzerRegistry.register(new PatternRelationshipAnalyzer());
blueprintAnalyzerRegistry.register(new StructureAnalyzer());
blueprintAnalyzerRegistry.register(new FlowAnalyzer());
blueprintAnalyzerRegistry.register(new MorphologyRuleAnalyzer());
blueprintAnalyzerRegistry.register(new TransitionRuleAnalyzer());
blueprintAnalyzerRegistry.register(new ConstraintAnalyzer());
blueprintAnalyzerRegistry.register(new RecommendationAnalyzer());
