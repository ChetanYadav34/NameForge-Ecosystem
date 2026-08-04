import { EvaluatedCandidateBatch } from "../evaluation/types";
import { ValidatedBlueprint } from "../validation/types";
import { GenerationPlan } from "../strategy/types";
import {
  FilteredCandidateBatch,
  FilteredCandidate,
  FilterDecision,
  FilteringSummary,
  FilteringContext,
  FilterReason
} from "./types";
import { filteringRegistry } from "./registry";

export class FilteringAggregator {
  summarize(candidates: FilteredCandidate[]): FilteringSummary {
    let accepted = 0;
    let rejected = 0;
    const rejectionReasons: Record<string, number> = {};
    const ruleStatistics: Record<string, number> = {};

    for (const c of candidates) {
      if (c.decision.accepted) {
        accepted++;
      } else {
        rejected++;
        for (const reason of c.decision.reasons) {
          if (!rejectionReasons[reason.ruleId]) rejectionReasons[reason.ruleId] = 0;
          rejectionReasons[reason.ruleId]++;
        }
      }

      for (const ruleId of c.decision.triggeredRules) {
        if (!ruleStatistics[ruleId]) ruleStatistics[ruleId] = 0;
        ruleStatistics[ruleId]++;
      }
    }

    const total = candidates.length;
    return {
      acceptedCount: accepted,
      rejectedCount: rejected,
      acceptanceRate: total > 0 ? accepted / total : 0,
      rejectionReasons,
      ruleStatistics
    };
  }
}

export class CandidateFilteringEngine {
  private aggregator = new FilteringAggregator();

  filter(
    batch: EvaluatedCandidateBatch,
    plan: GenerationPlan,
    blueprint: ValidatedBlueprint
  ): FilteredCandidateBatch {
    const context: FilteringContext = { plan, blueprint };
    const rules = filteringRegistry.getAll();
    
    const filteredCandidates: FilteredCandidate[] = batch.candidates.map(evaluatedCandidate => {
      const reasons: FilterReason[] = [];
      const triggeredRules: string[] = [];
      
      for (const rule of rules) {
        const reason = rule.evaluate(evaluatedCandidate, context);
        if (reason) {
          reasons.push(reason);
          triggeredRules.push(rule.id);
        }
      }

      const decision: FilterDecision = {
        accepted: reasons.length === 0,
        reasons,
        triggeredRules
      };

      return {
        evaluatedCandidate,
        decision
      };
    });

    const summary = this.aggregator.summarize(filteredCandidates);

    return Object.freeze({
      id: crypto.randomUUID(),
      sourceBatchId: batch.id,
      candidates: filteredCandidates,
      summary,
      filteredAt: new Date().toISOString()
    });
  }
}

export const filteringEngine = new CandidateFilteringEngine();
