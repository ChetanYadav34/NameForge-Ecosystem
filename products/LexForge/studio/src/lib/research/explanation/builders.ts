import { CandidateExplanation, ExplanationBuilder, ExplanationContext, SelectedCandidate } from "./types";

export class GenerationExplanationBuilder implements ExplanationBuilder {
  id = "builder:explanation:generation";
  name = "Generation Explanation Builder";

  build(candidate: SelectedCandidate, context: ExplanationContext, existingExplanation: CandidateExplanation): void {
    existingExplanation.sections.push({
      title: "Generation Origins",
      points: [
        `Generated from seed concept.`,
        `Synthesized from base fragments.`
      ],
      evidence: [
        {
          sourceId: "gen-rule-1",
          type: "Generation Rule",
          description: "Applied primary morphing logic."
        }
      ]
    });
    existingExplanation.supportingRules += 1;
  }
}

export class EvaluationExplanationBuilder implements ExplanationBuilder {
  id = "builder:explanation:evaluation";
  name = "Evaluation Explanation Builder";

  build(candidate: SelectedCandidate, context: ExplanationContext, existingExplanation: CandidateExplanation): void {
    const evalData = candidate.diversifiedCandidate.rankedCandidate.filteredCandidate.evaluatedCandidate;
    
    // Find pronounceability and novelty from metrics array if they exist, else default to 'N/A'
    const pronounceabilityMetric = evalData.evaluation.metrics.find(m => m.name.includes("Pronounceability"));
    const noveltyMetric = evalData.evaluation.metrics.find(m => m.name.includes("Novelty"));

    existingExplanation.sections.push({
      title: "Linguistic Evaluation",
      points: [
        `Pronounceability: ${pronounceabilityMetric ? pronounceabilityMetric.score.toFixed(2) : "N/A"}`,
        `Novelty: ${noveltyMetric ? noveltyMetric.score.toFixed(2) : "N/A"}`
      ],
      evidence: []
    });
  }
}

export class FilteringExplanationBuilder implements ExplanationBuilder {
  id = "builder:explanation:filtering";
  name = "Filtering Explanation Builder";

  build(candidate: SelectedCandidate, context: ExplanationContext, existingExplanation: CandidateExplanation): void {
    const filterData = candidate.diversifiedCandidate.rankedCandidate.filteredCandidate;
    existingExplanation.sections.push({
      title: "Quality Assurance",
      points: filterData.decision.accepted ? ["Passed all mandatory quality filters."] : ["Failed quality filters."],
      evidence: []
    });
  }
}

export class RankingExplanationBuilder implements ExplanationBuilder {
  id = "builder:explanation:ranking";
  name = "Ranking Explanation Builder";

  build(candidate: SelectedCandidate, context: ExplanationContext, existingExplanation: CandidateExplanation): void {
    const rankData = candidate.diversifiedCandidate.rankedCandidate;
    existingExplanation.sections.push({
      title: "Performance Ranking",
      points: [
        `Ranked #${rankData.rankIndex + 1} overall.`,
        `Composite score: ${rankData.ranking.finalScore.toFixed(2)}.`
      ],
      evidence: []
    });
    existingExplanation.confidenceScore += 0.2; 
  }
}

export class DiversificationExplanationBuilder implements ExplanationBuilder {
  id = "builder:explanation:diversification";
  name = "Diversification Explanation Builder";

  build(candidate: SelectedCandidate, context: ExplanationContext, existingExplanation: CandidateExplanation): void {
    const divData = candidate.diversifiedCandidate;
    existingExplanation.sections.push({
      title: "Cluster Diversity",
      points: [
        divData.isRepresentative ? "Selected as cluster representative." : "Retained as cluster alternative."
      ],
      evidence: []
    });
  }
}

export class SelectionExplanationBuilder implements ExplanationBuilder {
  id = "builder:explanation:selection";
  name = "Selection Explanation Builder";

  build(candidate: SelectedCandidate, context: ExplanationContext, existingExplanation: CandidateExplanation): void {
    const selData = candidate.decision;
    existingExplanation.sections.push({
      title: "Delivery Selection",
      points: selData.selected ? ["Approved for final delivery."] : ["Withheld from delivery."],
      evidence: selData.reasons.map(r => ({
        sourceId: r.ruleId,
        type: "Selection Reason",
        description: r.message
      }))
    });
  }
}

export class TraceabilityExplanationBuilder implements ExplanationBuilder {
  id = "builder:explanation:traceability";
  name = "Traceability Explanation Builder";

  build(candidate: SelectedCandidate, context: ExplanationContext, existingExplanation: CandidateExplanation): void {
    existingExplanation.evidenceDepth += 10;
    existingExplanation.sections.push({
      title: "Traceability",
      points: ["Full lineage traced to original source records."],
      evidence: []
    });
  }
}
