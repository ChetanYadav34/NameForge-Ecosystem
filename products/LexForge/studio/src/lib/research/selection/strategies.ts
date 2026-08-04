import { DiversifiedCandidateBatch, SelectedCandidate, SelectionContext, SelectionDecision, SelectionStrategy } from "./types";

function simpleSelection(batch: DiversifiedCandidateBatch, maxResults: number, requireRepresentative: boolean): SelectedCandidate[] {
  const selected: SelectedCandidate[] = [];

  for (const candidate of batch.candidates) {
    if (requireRepresentative && !candidate.isRepresentative) {
      selected.push({
        diversifiedCandidate: candidate,
        decision: {
          selected: false,
          reasons: [{ ruleId: "requireRepresentative", message: "Candidate is not a cluster representative." }]
        }
      });
      continue;
    }

    if (selected.filter(s => s.decision.selected).length >= maxResults) {
      selected.push({
        diversifiedCandidate: candidate,
        decision: {
          selected: false,
          reasons: [{ ruleId: "maxResults", message: "Maximum results limit reached." }]
        }
      });
      continue;
    }

    selected.push({
      diversifiedCandidate: candidate,
      decision: {
        selected: true,
        reasons: [{ ruleId: "accepted", message: "Candidate selected for delivery." }]
      }
    });
  }

  return selected;
}

export class BalancedSelectionStrategy implements SelectionStrategy {
  id = "strategy:selection:balanced";
  name = "Balanced Selection Strategy";

  select(batch: DiversifiedCandidateBatch, context: SelectionContext): SelectedCandidate[] {
    return simpleSelection(batch, 50, true);
  }
}

export class CommercialSelectionStrategy implements SelectionStrategy {
  id = "strategy:selection:commercial";
  name = "Commercial Selection Strategy";

  select(batch: DiversifiedCandidateBatch, context: SelectionContext): SelectedCandidate[] {
    return simpleSelection(batch, 30, true);
  }
}

export class InnovationSelectionStrategy implements SelectionStrategy {
  id = "strategy:selection:innovation";
  name = "Innovation Selection Strategy";

  select(batch: DiversifiedCandidateBatch, context: SelectionContext): SelectedCandidate[] {
    return simpleSelection(batch, 20, false); // Might allow alternates
  }
}

export class MedicalSelectionStrategy implements SelectionStrategy {
  id = "strategy:selection:medical";
  name = "Medical Selection Strategy";

  select(batch: DiversifiedCandidateBatch, context: SelectionContext): SelectedCandidate[] {
    return simpleSelection(batch, 25, true);
  }
}

export class FantasySelectionStrategy implements SelectionStrategy {
  id = "strategy:selection:fantasy";
  name = "Fantasy Selection Strategy";

  select(batch: DiversifiedCandidateBatch, context: SelectionContext): SelectedCandidate[] {
    return simpleSelection(batch, 100, false);
  }
}

export class BrandSelectionStrategy implements SelectionStrategy {
  id = "strategy:selection:brand";
  name = "Brand Selection Strategy";

  select(batch: DiversifiedCandidateBatch, context: SelectionContext): SelectedCandidate[] {
    return simpleSelection(batch, 10, true);
  }
}
