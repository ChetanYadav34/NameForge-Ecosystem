import { CreateGenerationJobRequest, GenerationJob } from "../../jobs/types";
import { GenerationRequestDTO, JobSummaryDTO, GenerationResultDTO } from "./dto";

export class GenerationMapper {
  toCreateJobRequest(dto: GenerationRequestDTO): CreateGenerationJobRequest {
    return {
      request: {
        seed: dto.seed,
        objective: dto.objective,
        strategy: dto.strategy || "default",
        settings: dto.settings || {}
      },
      priority: dto.priority ?? 50
    };
  }

  toJobSummary(job: GenerationJob): JobSummaryDTO {
    return {
      id: job.id,
      status: job.status,
      priority: job.priority,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt
    };
  }

  toGenerationResult(job: GenerationJob): GenerationResultDTO | undefined {
    if (!job.result) return undefined;
    
    // Extract candidates from explainedCandidateBatch or candidates array if available
    let candidates: any[] = [];
    if (job.result.artifacts?.explainedCandidateBatch?.candidates) {
      candidates = job.result.artifacts.explainedCandidateBatch.candidates;
    } else if (Array.isArray(job.result.artifacts?.explainedCandidateBatch)) {
      candidates = job.result.artifacts.explainedCandidateBatch;
    } else if (job.result.artifacts?.candidateBatch?.candidates) {
      candidates = job.result.artifacts.candidateBatch.candidates;
    }

    const flatCandidates = candidates.map(c => {
      // Safely traverse the nested structure
      const explanation = c.explanation || {};
      const selected = c.selectedCandidate || c;
      const diversified = selected.diversifiedCandidate || selected;
      const cluster = diversified.cluster || {};
      const representative = cluster.representative || diversified;
      const filtered = representative.filteredCandidate || representative;
      const evaluated = filtered.evaluatedCandidate || filtered;
      const base = evaluated.candidate || evaluated;
      
      const rankScore = representative.ranking?.finalScore ?? evaluated.evaluation?.overallScore ?? 0;
      
      return {
        id: base.id || c.id || "unknown",
        name: base.value || base.term || "Unnamed",
        score: rankScore,
        rank: representative.rankIndex ?? 0,
        confidence: explanation.confidenceScore ?? 0,
        status: filtered.decision?.accepted ? "accepted" : (filtered.decision ? "rejected" : "generated"),
        shortExplanation: explanation.sections?.[0]?.points?.[0] || explanation.summary || "Generated successfully.",
        details: {
          overview: explanation.sections || [],
          metrics: evaluated.evaluation || {},
          fragments: base.fragments || [],
          ranking: representative.ranking || {},
          selectionReason: selected.decision?.reasons || [],
          trace: explanation.sections?.flatMap((s: any) => s.evidence) || [],
          rawJson: JSON.stringify(c, null, 2)
        }
      };
    });

    return {
      jobId: job.id,
      status: job.status,
      candidates: flatCandidates,
      explanations: job.result.artifacts?.explainedCandidateBatch || {},
      artifacts: job.result.artifacts,
      metrics: job.result.metrics,
      artifactsAvailable: Object.keys(job.result.artifacts).filter(k => job.result!.artifacts[k as keyof typeof job.result.artifacts] !== undefined)
    };
  }
}

export const generationMapper = new GenerationMapper();
