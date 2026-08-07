import { MasterAssembler } from "../planners/assembler";
import { EnglishLanguagePlugin } from "../plugins/english";
import { MemoryCorpusProvider } from "../providers/loaders/memory";
import { ConstraintSolver } from "../constraints/engine";
import { ENGLISH_CONSTRAINTS } from "../plugins/english/constraints";
import { BENCHMARK_PROMPTS } from "./datasets";

export async function runBenchmarks(): Promise<void> {
  console.log("Initializing Phase 24 Benchmark Runner...");

  const plugin = new EnglishLanguagePlugin();
  const corpus = new MemoryCorpusProvider();
  await corpus.load();

  const solver = new ConstraintSolver();
  for (const c of ENGLISH_CONSTRAINTS) {
    solver.register(c);
  }

  const { PlannerRegistry } = require("../planners/assembler");
  const { SemanticPlanner } = require("../planners/semantic");
  const { MorphologyPlanner } = require("../planners/morphology");
  const { PhonologyPlanner } = require("../planners/phonology");
  const { OrthographyPlanner } = require("../planners/orthography");
  const { SeededRNG } = require("../utils/rng");

  const registry = new PlannerRegistry();
  registry.registerSemantic(new SemanticPlanner());
  registry.registerMorphological(new MorphologyPlanner());
  registry.registerPhonological(new PhonologyPlanner());
  registry.registerOrthographic(new OrthographyPlanner());

  const plannerContext = {
    rng: new SeededRNG("test"),
    plugin,
    corpus,
    solver
  };

  const assembler = new MasterAssembler(registry, plannerContext);

  console.log(`Executing ${BENCHMARK_PROMPTS.length} benchmark prompts...`);

  const results = [];

  for (const prompt of BENCHMARK_PROMPTS) {
    console.log(`\n--- Prompt: ${prompt.description} (${prompt.targetArchetype}) ---`);
    
    // In actual usage, MasterAssembler.compile takes an IntentIR
    // We mock the IntentIR for the benchmark
    const intent = {
      id: crypto.randomUUID(),
      seed: prompt.seed,
      prompt: prompt.description,
      requestedLanguages: ["en"],
      minLength: 4,
      maxLength: 10,
      semanticSeeds: ["sem:tech", "sem:future"] // Mocking semantic seeds based on loaded dataset
    };

    const start = performance.now();
    const candidates = await assembler.compile(intent);
    const end = performance.now();

    console.log(`Generated ${candidates.length} candidates in ${(end - start).toFixed(2)}ms`);

    for (const c of candidates.slice(0, 5)) {
      console.log(`- ${c.orthography} (Score: ${c.scores[0]?.value ?? 0})`);
    }

    results.push({
      prompt: prompt.description,
      timeMs: end - start,
      candidateCount: candidates.length
    });
  }

  console.log("\nBenchmark Complete.");
  console.table(results);
}
