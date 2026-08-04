import { GenerationRequest, GenerationSessionResult } from "../research/session/types";

export type JobStatus = 
  | "Pending" 
  | "Queued" 
  | "Running" 
  | "Paused" 
  | "Cancelled" 
  | "Completed" 
  | "Failed" 
  | "Retrying";

export interface JobEvent {
  jobId: string;
  status: JobStatus;
  timestamp: string;
  message?: string;
  error?: string;
  progressPercentage?: number;
}

export interface JobExecution {
  attempt: number;
  startTime: string;
  endTime?: string;
  status: JobStatus;
  error?: string;
}

export interface CreateGenerationJobRequest {
  request: GenerationRequest;
  priority: number;
  maxRetries?: number;
}

export interface GenerationJob {
  id: string;
  priority: number;
  status: JobStatus;
  request: GenerationRequest;
  result?: GenerationSessionResult;
  history: JobExecution[];
  createdAt: string;
  updatedAt: string;
  maxRetries: number;
}

export interface JobQueue {
  enqueue(job: GenerationJob): void;
  dequeue(): GenerationJob | undefined;
  peek(): GenerationJob | undefined;
  size(): number;
  remove(jobId: string): void;
}

export interface JobStorage {
  save(job: GenerationJob): Promise<void>;
  get(jobId: string): Promise<GenerationJob | undefined>;
  getAll(): Promise<GenerationJob[]>;
  delete(jobId: string): Promise<void>;
}
