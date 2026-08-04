import { CreateGenerationJobRequest, GenerationJob } from "./types";
import { jobQueue } from "./queue";
import { jobStorage } from "./storage";
import { jobScheduler } from "./scheduler";
import { jobEventBus } from "./events";

export class GenerationJobEngine {
  
  async createJob(request: CreateGenerationJobRequest): Promise<GenerationJob> {
    const job: GenerationJob = {
      id: crypto.randomUUID(),
      priority: request.priority,
      status: "Pending",
      request: request.request,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      maxRetries: request.maxRetries ?? 3
    };

    await jobStorage.save(job);
    jobEventBus.emit({ jobId: job.id, status: job.status, timestamp: new Date().toISOString() });
    
    this.queueJob(job);
    return job;
  }

  private queueJob(job: GenerationJob): void {
    job.status = "Queued";
    job.updatedAt = new Date().toISOString();
    jobStorage.save(job).catch(console.error);
    jobEventBus.emit({ jobId: job.id, status: job.status, timestamp: new Date().toISOString() });
    
    jobQueue.enqueue(job);
    jobScheduler.startProcessing().catch(console.error);
  }

  async getJob(jobId: string): Promise<GenerationJob | undefined> {
    return jobStorage.get(jobId);
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = await jobStorage.get(jobId);
    if (!job) return;

    if (job.status === "Queued" || job.status === "Pending" || job.status === "Paused" || job.status === "Retrying") {
      jobQueue.remove(jobId);
      job.status = "Cancelled";
      job.updatedAt = new Date().toISOString();
      await jobStorage.save(job);
      jobEventBus.emit({ jobId: job.id, status: job.status, timestamp: new Date().toISOString() });
    } else if (job.status === "Running") {
      // It's actively running. Note: In a fully wired system we would pass the cancellation token 
      // down into the scheduler to abort it actively. Here we simply mark it.
      job.status = "Cancelled";
      job.updatedAt = new Date().toISOString();
      await jobStorage.save(job);
      jobEventBus.emit({ jobId: job.id, status: job.status, timestamp: new Date().toISOString() });
    }
  }

  async pauseJob(jobId: string): Promise<void> {
    const job = await jobStorage.get(jobId);
    if (!job || job.status !== "Queued") return;

    jobQueue.remove(jobId);
    job.status = "Paused";
    job.updatedAt = new Date().toISOString();
    await jobStorage.save(job);
    jobEventBus.emit({ jobId: job.id, status: job.status, timestamp: new Date().toISOString() });
  }

  async resumeJob(jobId: string): Promise<void> {
    const job = await jobStorage.get(jobId);
    if (!job || job.status !== "Paused") return;

    this.queueJob(job);
  }

}

export const jobEngine = new GenerationJobEngine();
