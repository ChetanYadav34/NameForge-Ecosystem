export interface GenerationRequest {
  seed: string;
  objective: string;
  strategy: string;
  settings: Record<string, any>;
}

export interface CancellationToken {
  isCancelled: boolean;
  cancel(): void;
}

export interface PipelineEvent {
  stage: string;
  status: "started" | "completed" | "failed";
  timestamp: string;
  durationMs?: number;
  error?: string;
}

export interface PipelineProgress {
  currentStage: string;
  completedStages: string[];
  totalStages: number;
  percentComplete: number;
}

export interface ExecutionMetrics {
  totalDurationMs: number;
  stageTimings: Record<string, number>;
  memoryUsageMb: number;
}

export interface GenerationSessionResult {
  request: GenerationRequest;
  artifacts: {
    categoryKnowledge?: any;
    categoryDNA?: any;
    categorySignature?: any;
    categoryBlueprint?: any;
    validatedBlueprint?: any;
    generationPlan?: any;
    candidateBatch?: any;
    evaluatedCandidateBatch?: any;
    filteredCandidateBatch?: any;
    rankedCandidateBatch?: any;
    diversifiedCandidateBatch?: any;
    selectedCandidateBatch?: any;
    explainedCandidateBatch?: any;
  };
  metrics: ExecutionMetrics;
  events: PipelineEvent[];
  status: "success" | "failed" | "cancelled";
}

export interface PipelineStageResult<T> {
  artifact: T;
  durationMs: number;
}

export interface PipelineStage<TIn, TOut> {
  id: string;
  name: string;
  execute(input: TIn, token: CancellationToken): Promise<PipelineStageResult<TOut>>;
}

export interface PipelineObserver {
  onProgress(progress: PipelineProgress): void;
  onEvent(event: PipelineEvent): void;
}
