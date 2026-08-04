// Types
export * from "./types";

// Engine
export * from "./engine";

// Registry
import { filteringRegistry } from "./registry";
export { filteringRegistry };

// Rules
import {
  MinimumCompositeScoreFilter,
  PronounceabilityThresholdFilter,
  DomainConstraintFilter
} from "./rules/basic";

import {
  StructuralIntegrityFilter,
  LengthConstraintFilter,
  SyllableConstraintFilter,
  ForbiddenClusterFilter
} from "./rules/structural";

import {
  BlueprintComplianceFilter,
  TraceabilityFilter,
  DuplicateCandidateFilter
} from "./rules/integrity";

// Register default rules
filteringRegistry.register(new MinimumCompositeScoreFilter());
filteringRegistry.register(new PronounceabilityThresholdFilter());
filteringRegistry.register(new DomainConstraintFilter());

filteringRegistry.register(new StructuralIntegrityFilter());
filteringRegistry.register(new LengthConstraintFilter());
filteringRegistry.register(new SyllableConstraintFilter());
filteringRegistry.register(new ForbiddenClusterFilter());

filteringRegistry.register(new BlueprintComplianceFilter());
filteringRegistry.register(new TraceabilityFilter());
filteringRegistry.register(new DuplicateCandidateFilter());
