import { ExecutionMetrics } from "./types";

export class MetricsTracker {
  private startTime: number = Date.now();
  private stageTimings: Record<string, number> = {};

  recordStage(stage: string, durationMs: number): void {
    this.stageTimings[stage] = durationMs;
  }

  getMetrics(): ExecutionMetrics {
    const memory = process.memoryUsage ? process.memoryUsage().heapUsed / 1024 / 1024 : 0;
    
    return {
      totalDurationMs: Date.now() - this.startTime,
      stageTimings: { ...this.stageTimings },
      memoryUsageMb: Math.round(memory * 100) / 100
    };
  }
}
