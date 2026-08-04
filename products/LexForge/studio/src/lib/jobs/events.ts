import { JobEvent } from "./types";

export type JobEventListener = (event: JobEvent) => void;

export class JobEventBus {
  private listeners: JobEventListener[] = [];

  subscribe(listener: JobEventListener): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: JobEventListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  emit(event: JobEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        // Ignore listener errors
      }
    }
  }
}

export const jobEventBus = new JobEventBus();
