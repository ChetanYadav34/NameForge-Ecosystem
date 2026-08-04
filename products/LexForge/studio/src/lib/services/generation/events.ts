import { jobEventBus } from "../../jobs/events";
import { JobEvent } from "../../jobs/types";
import { ProgressDTO } from "./dto";

export type ServiceEventListener = (progress: ProgressDTO) => void;

export class GenerationServiceEventBus {
  private listeners: Map<string, ServiceEventListener[]> = new Map();

  constructor() {
    // Listen to internal job events and broadcast to public service listeners
    jobEventBus.subscribe(this.handleJobEvent.bind(this));
  }

  private handleJobEvent(event: JobEvent) {
    const listeners = this.listeners.get(event.jobId) || [];
    const progress: ProgressDTO = {
      jobId: event.jobId,
      status: event.status,
      attempt: 1, // Simplifying attempt retrieval for now
      message: event.message || event.error,
      progressPercentage: event.progressPercentage
    };
    
    for (const listener of listeners) {
      try {
        listener(progress);
      } catch (e) {
        // Ignore client listener errors
      }
    }
  }

  subscribeToJob(jobId: string, listener: ServiceEventListener): () => void {
    const current = this.listeners.get(jobId) || [];
    this.listeners.set(jobId, [...current, listener]);

    return () => {
      const active = this.listeners.get(jobId) || [];
      this.listeners.set(jobId, active.filter(l => l !== listener));
    };
  }
}

export const serviceEventBus = new GenerationServiceEventBus();
