export interface GenerationRequestDTO {
  seed: string;
  objective: string;
  strategy?: string;
  settings?: Record<string, any>;
  priority?: number;
}

export interface JobSummaryDTO {
  id: string;
  status: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressDTO {
  jobId: string;
  status: string;
  attempt: number;
  message?: string;
  progressPercentage?: number;
}

export interface GenerationResultDTO {
  jobId: string;
  status: string;
  candidates?: CandidateDTO[];
  explanations?: Record<string, any>;
  artifacts?: Record<string, any>;
  metrics?: any;
  artifactsAvailable: string[];
}

export interface CandidateDetailsDTO {
  overview?: Record<string, any>;
  metrics?: Record<string, any>;
  fragments?: any[];
  ranking?: Record<string, any>;
  selectionReason?: any;
  trace?: any[];
  rawJson?: string;
}

export interface CandidateDTO {
  id: string;
  name: string;
  score: number;
  rank: number;
  confidence: number;
  status: string;
  shortExplanation: string;
  details?: CandidateDetailsDTO;
}

export interface ArtifactDTO {
  type: string;
  data: any;
}
