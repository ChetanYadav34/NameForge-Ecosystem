import {
  CancellationToken,
  GenerationRequest,
  GenerationSessionResult,
  PipelineObserver,
  PipelineStage
} from "./types";
import { PipelineOrchestrator } from "./pipeline";
import { CancellationError } from "./errors";

// Engine Imports
import { ValidatedBlueprint } from "../validation/types";
import { GenerationPlan } from "../strategy/types";
import { CandidateBatch } from "../generation/types";
import { EvaluatedCandidateBatch } from "../evaluation/types";
import { FilteredCandidateBatch } from "../filtering/types";
import { RankedCandidateBatch } from "../ranking/types";
import { DiversifiedCandidateBatch } from "../diversification/types";
import { SelectedCandidateBatch } from "../selection/types";
import { ExplainedCandidateBatch } from "../explanation/types";

import { categoryDNAEngine } from "../dna";
import { patternIntelligenceEngine } from "../intelligence";
import { blueprintEngine } from "../blueprint";
import { validationEngine } from "../validation";
import { strategyEngine } from "../strategy";
import { constructionEngine } from "../generation";
import { evaluationEngine } from "../evaluation";
import { filteringEngine } from "../filtering";
import { rankingEngine } from "../ranking";
import { diversificationEngine } from "../diversification";
import { selectionEngine } from "../selection";
import { explanationEngine } from "../explanation";

function createMockLexEntry(word: string): any {
  return {
    id: 1,
    word,
    vowels: ['a'],
    consonants: ['b'],
    phonemes: ['b', 'a'],
    syllables: [word],
    partOfSpeech: ['noun'],
    domains: ['finance'],
    vowelCount: 1,
    consonantCount: 1,
    phonemeCount: 2,
    length: word.length,
    frequency: { zipf: 5, band: "common" }
  };
}

class DiscoveryStage implements PipelineStage<GenerationRequest, any> {
  id = "stage:discovery";
  name = "Knowledge Discovery";
  async execute(input: GenerationRequest, token: CancellationToken) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { 
      artifact: { 
        type: "CategoryKnowledge",
        seed: input.seed,
        version: "1.0",
        acceptedVocabulary: [
          { term: "fintech", lexEntry: createMockLexEntry("fintech"), evidence: [] },
          { term: "pay", lexEntry: createMockLexEntry("pay"), evidence: [] },
          { term: "money", lexEntry: createMockLexEntry("money"), evidence: [] },
          { term: "flow", lexEntry: createMockLexEntry("flow"), evidence: [] },
          { term: "trust", lexEntry: createMockLexEntry("trust"), evidence: [] },
          { term: "bank", lexEntry: createMockLexEntry("bank"), evidence: [] }
        ]
      }, 
      durationMs: 300 
    };
  }
}

class DNAStage implements PipelineStage<any, any> {
  id = "stage:dna";
  name = "Category DNA Extraction";
  async execute(input: any, token: CancellationToken) {
    return { artifact: categoryDNAEngine.build(input), durationMs: 10 };
  }
}

class IntelligenceStage implements PipelineStage<any, any> {
  id = "stage:intelligence";
  name = "Pattern Intelligence";
  async execute(input: any, token: CancellationToken) {
    return { artifact: patternIntelligenceEngine.build(input), durationMs: 10 };
  }
}

class BlueprintStage implements PipelineStage<any, any> {
  id = "stage:blueprint";
  name = "Category Blueprint Generation";
  async execute(input: any, token: CancellationToken) {
    return { artifact: blueprintEngine.build(input), durationMs: 10 };
  }
}

class ValidationStage implements PipelineStage<any, ValidatedBlueprint> {
  id = "stage:validation";
  name = "Blueprint Validation";
  async execute(input: any, token: CancellationToken) {
    return { artifact: validationEngine.validate(input), durationMs: 10 };
  }
}

class StrategyStage implements PipelineStage<ValidatedBlueprint, GenerationPlan> {
  id = "stage:strategy";
  name = "Generation Strategy";
  async execute(input: ValidatedBlueprint, token: CancellationToken) {
    return { artifact: strategyEngine.plan(input, { domain: "brand", styleTarget: "modern", primaryFocus: "safety" }), durationMs: 10 };
  }
}

class ConstructionStage implements PipelineStage<GenerationPlan, CandidateBatch> {
  id = "stage:construction";
  name = "Candidate Construction";
  async execute(input: GenerationPlan, token: CancellationToken) {
    return { artifact: await constructionEngine.construct(input), durationMs: 10 };
  }
}

class EvaluationStage implements PipelineStage<CandidateBatch, EvaluatedCandidateBatch> {
  id = "stage:evaluation";
  name = "Candidate Evaluation";
  constructor(private plan: GenerationPlan, private blueprint: ValidatedBlueprint) {}
  async execute(input: CandidateBatch, token: CancellationToken) {
    return { artifact: evaluationEngine.evaluate(input, this.plan, this.blueprint), durationMs: 10 };
  }
}

class FilteringStage implements PipelineStage<EvaluatedCandidateBatch, FilteredCandidateBatch> {
  id = "stage:filtering";
  name = "Candidate Filtering";
  constructor(private plan: GenerationPlan, private blueprint: ValidatedBlueprint) {}
  async execute(input: EvaluatedCandidateBatch, token: CancellationToken) {
    return { artifact: filteringEngine.filter(input, this.plan, this.blueprint), durationMs: 10 };
  }
}

class RankingStage implements PipelineStage<FilteredCandidateBatch, RankedCandidateBatch> {
  id = "stage:ranking";
  name = "Candidate Ranking";
  constructor(private plan: GenerationPlan, private blueprint: ValidatedBlueprint) {}
  async execute(input: FilteredCandidateBatch, token: CancellationToken) {
    return { artifact: rankingEngine.rank(input, this.plan, this.blueprint), durationMs: 10 };
  }
}

class DiversificationStage implements PipelineStage<RankedCandidateBatch, DiversifiedCandidateBatch> {
  id = "stage:diversification";
  name = "Candidate Diversification";
  constructor(private plan: GenerationPlan, private blueprint: ValidatedBlueprint) {}
  async execute(input: RankedCandidateBatch, token: CancellationToken) {
    return { artifact: diversificationEngine.diversify(input, this.plan, this.blueprint), durationMs: 10 };
  }
}

class SelectionStage implements PipelineStage<DiversifiedCandidateBatch, SelectedCandidateBatch> {
  id = "stage:selection";
  name = "Candidate Selection";
  constructor(private plan: GenerationPlan, private blueprint: ValidatedBlueprint) {}
  async execute(input: DiversifiedCandidateBatch, token: CancellationToken) {
    return { artifact: selectionEngine.select(input, this.plan, this.blueprint), durationMs: 10 };
  }
}

class ExplanationStage implements PipelineStage<SelectedCandidateBatch, ExplainedCandidateBatch> {
  id = "stage:explanation";
  name = "Candidate Explanation";
  constructor(private plan: GenerationPlan, private blueprint: ValidatedBlueprint) {}
  async execute(input: SelectedCandidateBatch, token: CancellationToken) {
    return { artifact: explanationEngine.explain(input, this.plan, this.blueprint), durationMs: 10 };
  }
}

export class NameGenerationSessionEngine {
  async executeSession(
    request: GenerationRequest,
    token: CancellationToken,
    observer?: PipelineObserver
  ): Promise<GenerationSessionResult> {
    const orchestrator = new PipelineOrchestrator();
    
    if (observer) {
      orchestrator.addObserver(observer);
    }

    const totalStages = 13;
    let completedCount = 0;
    const artifacts: any = {};

    try {
      artifacts.categoryKnowledge = await orchestrator.executeStage(new DiscoveryStage(), request, token, totalStages, completedCount++);
      artifacts.categoryDNA = await orchestrator.executeStage(new DNAStage(), artifacts.categoryKnowledge, token, totalStages, completedCount++);
      artifacts.categorySignature = await orchestrator.executeStage(new IntelligenceStage(), artifacts.categoryDNA, token, totalStages, completedCount++);
      artifacts.categoryBlueprint = await orchestrator.executeStage(new BlueprintStage(), artifacts.categorySignature, token, totalStages, completedCount++);
      artifacts.validatedBlueprint = await orchestrator.executeStage(new ValidationStage(), artifacts.categoryBlueprint, token, totalStages, completedCount++);
      artifacts.generationPlan = await orchestrator.executeStage(new StrategyStage(), artifacts.validatedBlueprint, token, totalStages, completedCount++);
      artifacts.candidateBatch = await orchestrator.executeStage(new ConstructionStage(), artifacts.generationPlan, token, totalStages, completedCount++);
      
      artifacts.evaluatedCandidateBatch = await orchestrator.executeStage(
        new EvaluationStage(artifacts.generationPlan, artifacts.validatedBlueprint), 
        artifacts.candidateBatch, token, totalStages, completedCount++
      );
      
      artifacts.filteredCandidateBatch = await orchestrator.executeStage(
        new FilteringStage(artifacts.generationPlan, artifacts.validatedBlueprint), 
        artifacts.evaluatedCandidateBatch, token, totalStages, completedCount++
      );
      
      artifacts.rankedCandidateBatch = await orchestrator.executeStage(
        new RankingStage(artifacts.generationPlan, artifacts.validatedBlueprint), 
        artifacts.filteredCandidateBatch, token, totalStages, completedCount++
      );
      
      artifacts.diversifiedCandidateBatch = await orchestrator.executeStage(
        new DiversificationStage(artifacts.generationPlan, artifacts.validatedBlueprint), 
        artifacts.rankedCandidateBatch, token, totalStages, completedCount++
      );
      
      artifacts.selectedCandidateBatch = await orchestrator.executeStage(
        new SelectionStage(artifacts.generationPlan, artifacts.validatedBlueprint), 
        artifacts.diversifiedCandidateBatch, token, totalStages, completedCount++
      );
      
      artifacts.explainedCandidateBatch = await orchestrator.executeStage(
        new ExplanationStage(artifacts.generationPlan, artifacts.validatedBlueprint), 
        artifacts.selectedCandidateBatch, token, totalStages, completedCount++
      );
      
      artifacts.CANDIDATES = artifacts.explainedCandidateBatch;

      return {
        request,
        artifacts,
        metrics: orchestrator.getMetricsTracker().getMetrics(),
        events: orchestrator.getEventsDispatcher().getEvents(),
        status: "success"
      };
    } catch (error) {
      return {
        request,
        artifacts,
        metrics: orchestrator.getMetricsTracker().getMetrics(),
        events: orchestrator.getEventsDispatcher().getEvents(),
        status: error instanceof CancellationError ? "cancelled" : "failed"
      };
    }
  }
}

export const sessionEngine = new NameGenerationSessionEngine();
