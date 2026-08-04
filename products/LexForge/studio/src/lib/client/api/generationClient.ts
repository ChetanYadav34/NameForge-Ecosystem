import { GenerationRequestDTO, JobSummaryDTO, GenerationResultDTO, ArtifactDTO } from "../../services/generation/dto";
import { NetworkError } from "../errors";

export class GenerationClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/generation") {
    this.baseUrl = baseUrl;
  }

  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new NetworkError(data.error?.message || "API request failed", data.error);
      }

      return data as T;
    } catch (err) {
      if (err instanceof NetworkError) throw err;
      throw new NetworkError(err instanceof Error ? err.message : "Network error");
    }
  }

  async createJob(request: GenerationRequestDTO): Promise<JobSummaryDTO> {
    return this.fetchApi<JobSummaryDTO>("", {
      method: "POST",
      body: JSON.stringify(request)
    });
  }

  async getJobs(page = 1, pageSize = 50): Promise<{ data: JobSummaryDTO[]; total: number }> {
    return this.fetchApi(`/jobs?page=${page}&pageSize=${pageSize}`);
  }

  async getJob(jobId: string): Promise<JobSummaryDTO> {
    return this.fetchApi<JobSummaryDTO>(`/jobs/${jobId}`);
  }

  async cancelJob(jobId: string): Promise<void> {
    await this.fetchApi(`/jobs/${jobId}/cancel`, { method: "POST" });
  }

  async pauseJob(jobId: string): Promise<void> {
    await this.fetchApi(`/jobs/${jobId}/pause`, { method: "POST" });
  }

  async resumeJob(jobId: string): Promise<void> {
    await this.fetchApi(`/jobs/${jobId}/resume`, { method: "POST" });
  }

  async restartJob(jobId: string): Promise<JobSummaryDTO> {
    return this.fetchApi<JobSummaryDTO>(`/jobs/${jobId}/restart`, { method: "POST" });
  }

  async getResult(jobId: string): Promise<GenerationResultDTO> {
    return this.fetchApi<GenerationResultDTO>(`/jobs/${jobId}/result`);
  }

  async getExplanation(jobId: string): Promise<ArtifactDTO> {
    return this.fetchApi<ArtifactDTO>(`/jobs/${jobId}/explanation`);
  }

  async getArtifacts(jobId: string): Promise<ArtifactDTO[]> {
    return this.fetchApi<ArtifactDTO[]>(`/jobs/${jobId}/artifacts`);
  }
}

export const generationClient = new GenerationClient();
