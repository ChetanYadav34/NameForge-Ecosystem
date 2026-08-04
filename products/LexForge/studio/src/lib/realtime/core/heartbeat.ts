import { ClientConnection } from "../types";
import { realtimeMetrics } from "./metrics";

export class HeartbeatManager {
  private intervals = new Map<string, NodeJS.Timeout>();

  constructor(private intervalMs: number = 30000) {}

  start(client: ClientConnection) {
    if (this.intervals.has(client.id)) return;

    const intervalId = setInterval(() => {
      try {
        client.send({
          eventId: crypto.randomUUID(),
          version: "1.0",
          timestamp: new Date().toISOString(),
          event: "Heartbeat",
          payload: { status: "alive" }
        });
      } catch (err) {
        realtimeMetrics.recordHeartbeatFailure();
        this.stop(client.id);
        client.close();
      }
    }, this.intervalMs);

    this.intervals.set(client.id, intervalId);
  }

  stop(clientId: string) {
    const intervalId = this.intervals.get(clientId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(clientId);
    }
  }

  stopAll() {
    for (const intervalId of this.intervals.values()) {
      clearInterval(intervalId);
    }
    this.intervals.clear();
  }
}

export const heartbeatManager = new HeartbeatManager();
