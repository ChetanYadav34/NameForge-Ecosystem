import { jobEngine } from "../../jobs/engine";
import { jobStorage } from "../../jobs/storage";
import { GenerationRequestDTO, JobSummaryDTO, GenerationResultDTO, ArtifactDTO, ProgressDTO } from "./dto";
import { requestValidator } from "./validators";
import { generationMapper } from "./mapper";
import { NotFoundError, ServiceError } from "./errors";
import { serviceEventBus, ServiceEventListener } from "./events";
import { PaginatedResult, PaginationOptions } from "./types";

export class GenerationService {
  async createGeneration(dto: GenerationRequestDTO): Promise<JobSummaryDTO> {
    requestValidator.validate(dto);
    const internalRequest = generationMapper.toCreateJobRequest(dto);
    
    try {
      const job = await jobEngine.createJob(internalRequest);
      return generationMapper.toJobSummary(job);
    } catch (err) {
      throw new ServiceError("CREATION_FAILED", "Failed to create generation job", err);
    }
  }

  async getJob(jobId: string): Promise<JobSummaryDTO> {
    const job = await jobEngine.getJob(jobId);
    if (!job) {
      throw new NotFoundError("Job", jobId);
    }
    return generationMapper.toJobSummary(job);
  }

  async listJobs(options: PaginationOptions = { page: 1, pageSize: 50 }): Promise<PaginatedResult<JobSummaryDTO>> {
    // Note: Since we are using InMemoryStorage we fetch all. In a real DB this would be a paginated query.
    const allJobs = await jobStorage.getAll();
    
    // Sort descending by created at
    allJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const start = (options.page - 1) * options.pageSize;
    const end = start + options.pageSize;
    const paginated = allJobs.slice(start, end);

    return {
      data: paginated.map(j => generationMapper.toJobSummary(j)),
      total: allJobs.length,
      page: options.page,
      pageSize: options.pageSize
    };
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = await jobEngine.getJob(jobId);
    if (!job) throw new NotFoundError("Job", jobId);
    await jobEngine.cancelJob(jobId);
  }

  async pauseJob(jobId: string): Promise<void> {
    const job = await jobEngine.getJob(jobId);
    if (!job) throw new NotFoundError("Job", jobId);
    await jobEngine.pauseJob(jobId);
  }

  async resumeJob(jobId: string): Promise<void> {
    const job = await jobEngine.getJob(jobId);
    if (!job) throw new NotFoundError("Job", jobId);
    await jobEngine.resumeJob(jobId);
  }

  async restartJob(jobId: string): Promise<JobSummaryDTO> {
    const job = await jobEngine.getJob(jobId);
    if (!job) throw new NotFoundError("Job", jobId);
    
    // Create a new job with the same request
    const internalRequest = {
      request: job.request,
      priority: job.priority,
      maxRetries: job.maxRetries
    };

    const newJob = await jobEngine.createJob(internalRequest);
    return generationMapper.toJobSummary(newJob);
  }

  async getResult(jobId: string): Promise<GenerationResultDTO> {
    const job = await jobEngine.getJob(jobId);
    if (!job) throw new NotFoundError("Job", jobId);
    if (!job.result) throw new ServiceError("NOT_READY", "Job has no result yet");
    
    return generationMapper.toGenerationResult(job)!;
  }

  async getExplanation(jobId: string): Promise<ArtifactDTO> {
    const job = await jobEngine.getJob(jobId);
    if (!job) throw new NotFoundError("Job", jobId);
    if (!job.result?.artifacts?.explainedCandidateBatch) {
      throw new NotFoundError("Artifact", `${jobId}/explanation`);
    }

    return {
      type: "ExplainedCandidateBatch",
      data: job.result.artifacts.explainedCandidateBatch
    };
  }

  async downloadArtifacts(jobId: string): Promise<ArtifactDTO[]> {
    const job = await jobEngine.getJob(jobId);
    if (!job) throw new NotFoundError("Job", jobId);
    if (!job.result) throw new ServiceError("NOT_READY", "Job has no result yet");

    const artifacts: ArtifactDTO[] = [];
    for (const [key, val] of Object.entries(job.result.artifacts)) {
      if (val !== undefined) {
        artifacts.push({
          type: key,
          data: val
        });
      }
    }
    return artifacts;
  }

  subscribeToProgress(jobId: string, listener: ServiceEventListener): () => void {
    return serviceEventBus.subscribeToJob(jobId, listener);
  }
}

export const generationService = new GenerationService();
