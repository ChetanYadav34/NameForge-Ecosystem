import { GenerationJob } from "./types";

export class RetryPolicy {
  shouldRetry(job: GenerationJob): boolean {
    const attempts = job.history.length;
    return attempts < job.maxRetries && job.status === "Failed";
  }

  getBackoffDelay(job: GenerationJob): number {
    const attempts = job.history.length;
    // Exponential backoff: 2s, 4s, 8s...
    return Math.pow(2, attempts) * 1000;
  }
}

export const retryPolicy = new RetryPolicy();
