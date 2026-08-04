// Core Engine & Types
export * from "./types";
export * from "./registry";
export * from "./engine";
export * from "./models/graph";

// Registries
import { 
  discoveryProviderRegistry, 
  researchPassRegistry, 
  confidenceRuleRegistry 
} from "./registry";

// Providers
import { WordNetDiscoveryProvider } from "./providers/wordnet";
import { DefinitionDiscoveryProvider } from "./providers/definition";
import { MorphologyDiscoveryProvider } from "./providers/morphology";

// Rules
import { SemanticRelationRule } from "./rules/semantic";
import { MorphologyRule } from "./rules/morphology";
import { DefinitionRule } from "./rules/definition";
import { MultiProviderRule } from "./rules/multiprovider";

// Passes
import { SeedResolutionPass } from "./passes/seed";
import { EvidenceDiscoveryPass } from "./passes/discovery";
import { EvidenceMergePass } from "./passes/merge";
import { CandidateBuilderPass } from "./passes/builder";
import { ConfidenceScoringPass } from "./passes/confidence";
import { CandidateRankingPass } from "./passes/ranking";
import { VocabularySelectionPass } from "./passes/selection";
import { VocabularyGraphConstructionPass } from "./passes/graph";
import { FeatureExtractionPass } from "./passes/extraction";
import { CategoryKnowledgeAssemblyPass } from "./passes/assembly";

// Initialize Providers
discoveryProviderRegistry.register(new WordNetDiscoveryProvider());
discoveryProviderRegistry.register(new DefinitionDiscoveryProvider());
discoveryProviderRegistry.register(new MorphologyDiscoveryProvider());

// Initialize Rules
confidenceRuleRegistry.register(new SemanticRelationRule());
confidenceRuleRegistry.register(new MorphologyRule());
confidenceRuleRegistry.register(new DefinitionRule());
confidenceRuleRegistry.register(new MultiProviderRule());

// Initialize Passes (Order defined by Priority)
researchPassRegistry.register(new SeedResolutionPass());
researchPassRegistry.register(new EvidenceDiscoveryPass());
researchPassRegistry.register(new EvidenceMergePass());
researchPassRegistry.register(new CandidateBuilderPass());
researchPassRegistry.register(new ConfidenceScoringPass());
researchPassRegistry.register(new CandidateRankingPass());
researchPassRegistry.register(new VocabularySelectionPass());
researchPassRegistry.register(new VocabularyGraphConstructionPass());
researchPassRegistry.register(new FeatureExtractionPass());
researchPassRegistry.register(new CategoryKnowledgeAssemblyPass());

// Export Engine
export { categoryEngine } from "./engine";
