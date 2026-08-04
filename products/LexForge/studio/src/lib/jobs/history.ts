import { GenerationJob, JobExecution, JobStatus } from "./types";

export class JobHistoryTracker {
  startExecution(job: GenerationJob): JobExecution {
    const attempt = job.history.length + 1;
    const execution: JobExecution = {
      attempt,
      startTime: new Date().toISOString(),
      status: "Running"
    };
    job.history.push(execution);
    return execution;
  }

  endExecution(job: GenerationJob, status: JobStatus, error?: string): void {
    if (job.history.length === 0) return;
    const current = job.history[job.history.length - 1];
    current.endTime = new Date().toISOString();
    current.status = status;
    if (error) current.error = error;
  }
}

export const jobHistoryTracker = new JobHistoryTracker();
