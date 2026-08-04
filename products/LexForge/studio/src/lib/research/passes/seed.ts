import { ResearchContext, ResearchPass } from "../types";
import { DatasetRepository } from "@/lib/dataset/repository";

export class SeedResolutionPass implements ResearchPass {
  id = "pass:seed-resolution";
  name = "Seed Resolution Pass";
  priority = 100;

  async execute(context: ResearchContext): Promise<void> {
    const entry = await DatasetRepository.findWord(context.seed);
    
    if (!entry) {
      context.session.errors.push(`SeedResolutionPass: The seed concept "${context.seed}" could not be found in the dataset.`);
      throw new Error(`SeedResolutionPass: The seed concept "${context.seed}" could not be found in the dataset.`);
    }

    // Initialize context state
    context.discoveredEvidence = [];
    context.candidatePool = new Map();
    context.acceptedVocabulary = [];
    context.rejectedVocabulary = [];
    
    context.session.statistics["seed_resolved"] = 1;
    
    // Create an initial evidence record for the seed itself so it becomes a candidate
    context.discoveredEvidence.push({
      id: "seed",
      provider: "system:seed",
      providerVersion: "1.0",
      source: "User Input",
      relation: "seed",
      strength: 1.0,
      confidence: 1.0,
      discoveredFrom: "user",
      distanceFromSeed: 0,
      timestamp: new Date().toISOString(),
      metadata: { target: context.seed }
    });
  }
}
