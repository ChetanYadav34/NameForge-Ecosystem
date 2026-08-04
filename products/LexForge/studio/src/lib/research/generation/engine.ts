import { GenerationPlan } from "../strategy/types";
import { CandidateBatch, CandidateFragment, GenerationRuntime } from "./types";
import { builderRegistry } from "./registry";
import { MasterAssembler } from "./builders";

export class CandidateConstructionEngine {
  private assembler = new MasterAssembler();

  construct(plan: GenerationPlan): CandidateBatch {
    let currentFragments: CandidateFragment[] = [];

    const runtime: GenerationRuntime = {
      plan,
      currentFragments
    };

    // Execute construction sequence
    for (const stage of plan.constructionSequence.stages) {
      // In a real implementation, stages define which builders to run
      // For now, we just run all registered builders in sequence
      const builders = builderRegistry.getAll();
      
      for (const builder of builders) {
        const newFragments = builder.build(runtime);
        currentFragments = [...currentFragments, ...newFragments];
        runtime.currentFragments = currentFragments;
      }
    }

    // Assemble candidates from collected fragments
    const candidates = this.assembler.assemble(currentFragments);

    return Object.freeze({
      id: crypto.randomUUID(),
      sourcePlanId: plan.id,
      candidates,
      generatedAt: new Date().toISOString()
    });
  }
}

export const constructionEngine = new CandidateConstructionEngine();
