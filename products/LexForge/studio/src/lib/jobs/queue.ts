import { GenerationJob, JobQueue } from "./types";

export class InMemoryJobQueue implements JobQueue {
  private queue: GenerationJob[] = [];

  enqueue(job: GenerationJob): void {
    this.queue.push(job);
    // Sort descending by priority, then ascending by createdAt for stable FIFO within same priority
    this.queue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  dequeue(): GenerationJob | undefined {
    return this.queue.shift();
  }

  peek(): GenerationJob | undefined {
    return this.queue[0];
  }

  size(): number {
    return this.queue.length;
  }

  remove(jobId: string): void {
    this.queue = this.queue.filter(j => j.id !== jobId);
  }
}

export const jobQueue = new InMemoryJobQueue();
