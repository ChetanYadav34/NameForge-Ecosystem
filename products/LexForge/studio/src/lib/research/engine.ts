import { ResearchContext, CategoryKnowledge, ResearchSession } from "./types";
import { researchPassRegistry } from "./registry";

export class CategoryEngine {
  /**
   * Builds a Category Knowledge Object by orchestrating the pass-based pipeline.
   * @param seed The core concept (e.g., "Fire")
   * @returns A constructed CategoryKnowledge object
   */
  async build(seed: string): Promise<CategoryKnowledge> {
    const session: ResearchSession = {
      id: crypto.randomUUID(),
      seed,
      version: "2.0.0",
      startedAt: new Date().toISOString(),
      providersExecuted: [],
      passesExecuted: [],
      executionMetrics: {},
      statistics: {},
      warnings: [],
      errors: []
    };

    const context: ResearchContext = {
      session,
      seed,
      discoveredEvidence: [],
      candidatePool: new Map(),
      acceptedVocabulary: [],
      rejectedVocabulary: [],
      profiles: {}
    };

    const passes = researchPassRegistry.getAll();

    for (const pass of passes) {
      context.session.passesExecuted.push(pass.id);
      
      try {
        await pass.execute(context);
      } catch (error: any) {
        context.session.errors.push(`Pipeline failed at pass [${pass.id}]: ${error.message}`);
        console.error(`Pipeline failed at pass [${pass.id}]:`, error);
        throw error;
      }
    }

    if (!context.categoryKnowledge) {
      throw new Error("Pipeline completed but CategoryKnowledge was not assembled.");
    }

    return context.categoryKnowledge;
  }
}

export const categoryEngine = new CategoryEngine();
