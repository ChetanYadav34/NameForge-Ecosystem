export interface TelemetryEvent {
  name: string;
  durationMs: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class Telemetry {
  private events: TelemetryEvent[] = [];
  private marks = new Map<string, number>();

  public mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  public measure(name: string, startMark: string, metadata?: Record<string, any>): void {
    const startTime = this.marks.get(startMark);
    if (startTime === undefined) {
      console.warn(`[Telemetry] Mark ${startMark} not found.`);
      return;
    }

    const durationMs = performance.now() - startTime;
    const event: TelemetryEvent = {
      name,
      durationMs,
      timestamp: Date.now(),
      metadata
    };

    this.events.push(event);
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Telemetry] ${name}: ${durationMs.toFixed(2)}ms`, metadata || '');
    }
  }

  public getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
    this.marks.clear();
  }
}

export const coreTelemetry = new Telemetry();
