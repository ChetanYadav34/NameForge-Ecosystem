import { CancellationToken, PipelineObserver, PipelineStage } from "./types";
import { EventDispatcher } from "./events";
import { MetricsTracker } from "./metrics";
import { CancellationError, PipelineError } from "./errors";

export class PipelineOrchestrator {
  private dispatcher = new EventDispatcher();
  private metrics = new MetricsTracker();

  addObserver(observer: PipelineObserver): void {
    this.dispatcher.addObserver(observer);
  }

  getMetricsTracker(): MetricsTracker {
    return this.metrics;
  }

  getEventsDispatcher(): EventDispatcher {
    return this.dispatcher;
  }

  async executeStage<TIn, TOut>(
    stage: PipelineStage<TIn, TOut>,
    input: TIn,
    token: CancellationToken,
    totalStages: number,
    completedCount: number
  ): Promise<TOut> {
    if (token.isCancelled) {
      throw new CancellationError();
    }

    this.dispatcher.dispatchEvent({
      stage: stage.name,
      status: "started",
      timestamp: new Date().toISOString()
    });

    this.dispatcher.dispatchProgress({
      currentStage: stage.name,
      completedStages: [], // simplified
      totalStages,
      percentComplete: Math.round((completedCount / totalStages) * 100)
    });

    try {
      const start = Date.now();
      const result = await stage.execute(input, token);
      const duration = Date.now() - start;
      
      this.metrics.recordStage(stage.name, duration);

      this.dispatcher.dispatchEvent({
        stage: stage.name,
        status: "completed",
        timestamp: new Date().toISOString(),
        durationMs: duration
      });

      return result.artifact;
    } catch (error) {
      this.dispatcher.dispatchEvent({
        stage: stage.name,
        status: "failed",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      });
      if (error instanceof CancellationError) {
        throw error;
      }
      throw new PipelineError(stage.name, error instanceof Error ? error.message : String(error));
    }
  }
}
