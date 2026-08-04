// Types
export * from "./types";

// Engine
export * from "./engine";

// Registry
import { evaluationRegistry } from "./registry";
export { evaluationRegistry };

// Analyzers
import {
  PronounceabilityAnalyzer,
  PhoneticFlowAnalyzer,
  ReadabilityAnalyzer,
  MemorabilityAnalyzer
} from "./analyzers/linguistic";

import {
  StructureAnalyzer,
  TransitionAnalyzer,
  MorphologyAnalyzer,
  LengthAnalyzer,
  SyllableAnalyzer,
  ClusterAnalyzer
} from "./analyzers/structural";

import {
  BlueprintComplianceAnalyzer,
  NoveltyAnalyzer,
  ConstructionIntegrityAnalyzer,
  TraceabilityAnalyzer
} from "./analyzers/integrity";

// Register default analyzers
evaluationRegistry.register(new PronounceabilityAnalyzer());
evaluationRegistry.register(new PhoneticFlowAnalyzer());
evaluationRegistry.register(new ReadabilityAnalyzer());
evaluationRegistry.register(new MemorabilityAnalyzer());

evaluationRegistry.register(new StructureAnalyzer());
evaluationRegistry.register(new TransitionAnalyzer());
evaluationRegistry.register(new MorphologyAnalyzer());
evaluationRegistry.register(new LengthAnalyzer());
evaluationRegistry.register(new SyllableAnalyzer());
evaluationRegistry.register(new ClusterAnalyzer());

evaluationRegistry.register(new BlueprintComplianceAnalyzer());
evaluationRegistry.register(new NoveltyAnalyzer());
evaluationRegistry.register(new ConstructionIntegrityAnalyzer());
evaluationRegistry.register(new TraceabilityAnalyzer());
