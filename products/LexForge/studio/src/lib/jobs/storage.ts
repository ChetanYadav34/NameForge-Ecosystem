import { GenerationJob, JobStorage } from "./types";

export class InMemoryJobStorage implements JobStorage {
  private store: Map<string, GenerationJob> = new Map();

  async save(job: GenerationJob): Promise<void> {
    this.store.set(job.id, JSON.parse(JSON.stringify(job))); // simulate deep copy persistence
  }

  async get(jobId: string): Promise<GenerationJob | undefined> {
    const job = this.store.get(jobId);
    return job ? JSON.parse(JSON.stringify(job)) : undefined;
  }

  async getAll(): Promise<GenerationJob[]> {
    return Array.from(this.store.values()).map(j => JSON.parse(JSON.stringify(j)));
  }

  async delete(jobId: string): Promise<void> {
    this.store.delete(jobId);
  }
}

export const jobStorage = new InMemoryJobStorage();
