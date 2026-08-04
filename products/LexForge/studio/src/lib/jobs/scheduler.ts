import { GenerationJob } from "./types";
import { jobQueue } from "./queue";
import { jobEventBus } from "./events";
import { jobStorage } from "./storage";
import { jobHistoryTracker } from "./history";
import { retryPolicy } from "./retry";
import { sessionEngine } from "../research/session/engine";

export class JobScheduler {
  private isProcessing = false;
  private activeJobs: Set<string> = new Set();
  private maxConcurrent = 2;

  async startProcessing(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.processNext();
  }

  stopProcessing(): void {
    this.isProcessing = false;
  }

  private async processNext(): Promise<void> {
    if (!this.isProcessing || this.activeJobs.size >= this.maxConcurrent) return;

    const job = jobQueue.dequeue();
    if (!job) return; // Queue empty

    if (job.status === "Cancelled" || job.status === "Paused") {
      // Skip processing
      this.processNext();
      return;
    }

    this.activeJobs.add(job.id);
    this.executeJob(job).finally(() => {
      this.activeJobs.delete(job.id);
      this.processNext(); // Try to process next job after this one finishes
    });

    // Also attempt to process another job concurrently if below limit
    this.processNext();
  }

  private async executeJob(job: GenerationJob): Promise<void> {
    job.status = "Running";
    jobEventBus.emit({ jobId: job.id, status: job.status, timestamp: new Date().toISOString() });
    
    const execution = jobHistoryTracker.startExecution(job);
    await jobStorage.save(job);

    try {
      const token = { isCancelled: false, cancel() { this.isCancelled = true; } };
      
      const observer = {
        onProgress: (p: any) => {
          jobEventBus.emit({
            jobId: job.id,
            status: "Running",
            timestamp: new Date().toISOString(),
            message: `Running stage: ${p.currentStage}`,
            progressPercentage: p.percentComplete
          });
        },
        onEvent: (e: any) => {
          // Could emit fine-grained events if needed
        }
      };

      // Execute via Session Engine
      const result = await sessionEngine.executeSession(job.request, token, observer);

      if (result.status === "success") {
        job.status = "Completed";
        job.result = result;
        jobHistoryTracker.endExecution(job, job.status);
      } else if (result.status === "cancelled") {
        job.status = "Cancelled";
        jobHistoryTracker.endExecution(job, job.status, "Session was cancelled");
      } else {
        throw new Error("Session engine failed");
      }
    } catch (err) {
      job.status = "Failed";
      const errorMsg = err instanceof Error ? err.message : String(err);
      jobHistoryTracker.endExecution(job, job.status, errorMsg);
      
      if (retryPolicy.shouldRetry(job)) {
        job.status = "Retrying";
        setTimeout(() => {
          jobQueue.enqueue(job);
          this.processNext();
        }, retryPolicy.getBackoffDelay(job));
      }
    }

    job.updatedAt = new Date().toISOString();
    await jobStorage.save(job);
    jobEventBus.emit({ jobId: job.id, status: job.status, timestamp: new Date().toISOString() });
  }
}

export const jobScheduler = new JobScheduler();
