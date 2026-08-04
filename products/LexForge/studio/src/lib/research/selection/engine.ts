import { DiversifiedCandidateBatch } from "../diversification/types";
import { ValidatedBlueprint } from "../validation/types";
import { GenerationPlan } from "../strategy/types";
import {
  SelectionContext,
  SelectionSummary,
  SelectedCandidateBatch
} from "./types";
import { selectionStrategyRegistry } from "./registry";
import { BalancedSelectionStrategy } from "./strategies";

export class CandidateSelectionEngine {
  select(
    batch: DiversifiedCandidateBatch,
    plan: GenerationPlan,
    blueprint: ValidatedBlueprint,
    strategyId?: string
  ): SelectedCandidateBatch {
    const context: SelectionContext = { plan, blueprint };
    
    // 1. Get Strategy
    const idToUse = strategyId || "strategy:selection:balanced";
    let strategy = selectionStrategyRegistry.get(idToUse);
    if (!strategy) {
      strategy = new BalancedSelectionStrategy();
    }

    // 2. Execute Selection
    const selectedCandidates = strategy.select(batch, context);

    // 3. Compute Summary
    let selectedCount = 0;
    let rejectedCount = 0;
    let sumRank = 0;
    let sumComposite = 0;
    let sumDiversity = 0;
    const representedClusters = new Set<string>();

    for (const candidate of selectedCandidates) {
      if (candidate.decision.selected) {
        selectedCount++;
        representedClusters.add(candidate.diversifiedCandidate.cluster.id);
        sumRank += candidate.diversifiedCandidate.rankedCandidate.rankIndex;
        sumComposite += candidate.diversifiedCandidate.rankedCandidate.ranking.finalScore;
        sumDiversity += candidate.diversifiedCandidate.cluster.diversityScore;
      } else {
        rejectedCount++;
      }
    }

    const summary: SelectionSummary = {
      selectedCount,
      rejectedCount,
      clustersRepresented: representedClusters.size,
      averageRank: selectedCount > 0 ? sumRank / selectedCount : 0,
      averageCompositeScore: selectedCount > 0 ? sumComposite / selectedCount : 0,
      averageDiversityScore: selectedCount > 0 ? sumDiversity / selectedCount : 0,
      strategyUsed: strategy.id
    };

    return Object.freeze({
      id: crypto.randomUUID(),
      sourceBatchId: batch.id,
      candidates: selectedCandidates,
      summary,
      selectedAt: new Date().toISOString()
    });
  }
}

export const selectionEngine = new CandidateSelectionEngine();
