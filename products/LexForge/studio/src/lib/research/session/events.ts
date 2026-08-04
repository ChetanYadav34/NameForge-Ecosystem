import { PipelineEvent, PipelineObserver, PipelineProgress } from "./types";

export class EventDispatcher {
  private observers: PipelineObserver[] = [];
  private events: PipelineEvent[] = [];

  addObserver(observer: PipelineObserver): void {
    this.observers.push(observer);
  }

  dispatchProgress(progress: PipelineProgress): void {
    for (const observer of this.observers) {
      try {
        observer.onProgress(progress);
      } catch (e) {
        // Ignore observer errors to prevent pipeline crash
      }
    }
  }

  dispatchEvent(event: PipelineEvent): void {
    this.events.push(event);
    for (const observer of this.observers) {
      try {
        observer.onEvent(event);
      } catch (e) {
        // Ignore observer errors
      }
    }
  }

  getEvents(): PipelineEvent[] {
    return [...this.events];
  }
}
