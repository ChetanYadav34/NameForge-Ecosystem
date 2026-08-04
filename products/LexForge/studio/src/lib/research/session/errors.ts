export class PipelineError extends Error {
  constructor(public stage: string, message: string) {
    super(`[Pipeline Error in ${stage}]: ${message}`);
    this.name = "PipelineError";
  }
}

export class CancellationError extends Error {
  constructor(message: string = "Pipeline execution was cancelled.") {
    super(message);
    this.name = "CancellationError";
  }
}
