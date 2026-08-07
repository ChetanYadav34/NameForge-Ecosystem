import { GenerationPlan } from "../strategy/types";
import { CandidateBatch } from "./types";
import { MasterAssembler, PlannerRegistry, PlannerContext } from "../../linguistics/planners/assembler";
import { SemanticPlanner } from "../../linguistics/planners/semantic";
import { MorphologyPlanner } from "../../linguistics/planners/morphology";
import { PhonologyPlanner } from "../../linguistics/planners/phonology";
import { OrthographyPlanner } from "../../linguistics/planners/orthography";
import { EnglishLanguagePlugin } from "../../linguistics/plugins/english";
import { MemoryCorpusProvider } from "../../linguistics/providers/loaders/memory";
import { ConstraintSolver } from "../../linguistics/constraints/engine";
import { SeededRNG } from "../../linguistics/utils/rng";
import { IntentIR } from "../../linguistics/models/ir";

export class CandidateConstructionEngine {
  private registry = new PlannerRegistry();

  constructor() {
    // Register baseline planners
    this.registry.registerSemantic(new SemanticPlanner());
    this.registry.registerMorphological(new MorphologyPlanner());
    this.registry.registerPhonological(new PhonologyPlanner());
    this.registry.registerOrthographic(new OrthographyPlanner());
  }

  async construct(plan: GenerationPlan): Promise<CandidateBatch> {
    const seed = crypto.randomUUID(); // In future, comes from user request
    const rng = new SeededRNG(seed);
    
    // Initialize required providers
    const plugin = new EnglishLanguagePlugin();
    const corpus = new MemoryCorpusProvider();
    await corpus.load();
    
    const solver = new ConstraintSolver();
    
    const context: PlannerContext = { rng, plugin, corpus, solver };
    const assembler = new MasterAssembler(this.registry, context);

    // Map legacy GenerationPlan to new IntentIR
    const intent: IntentIR = {
      id: crypto.randomUUID(),
      seed,
      prompt: "intent prompt",
      requestedLanguages: ["en"],
      minLength: 4,
      maxLength: 10,
      semanticSeeds: ["tech", "future"] // Mocked from plan for MVP
    };

    // Execute compilation
    const start = performance.now();
    const candidates = assembler.compile(intent);
    const end = performance.now();

    // Map LinguisticCandidate to the legacy Candidate format expected by CandidateBatch
    const legacyCandidates = candidates.map((c, i) => ({
      id: c.id,
      value: c.orthography,
      fragments: [],
      metadata: {
        complexity: 1.0,
        pronounceability: 1.0,
        uniqueness: 1.0,
        explanation: "Generated via IR Compiler"
      }
    }));

    return Object.freeze({
      id: crypto.randomUUID(),
      sourcePlanId: plan.id,
      candidates: legacyCandidates,
      generatedAt: new Date().toISOString()
    });
  }
}

export const constructionEngine = new CandidateConstructionEngine();
