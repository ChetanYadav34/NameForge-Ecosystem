import { RealtimeMetrics } from "../types";

class MetricsCollector {
  private metrics: RealtimeMetrics = {
    activeConnections: 0,
    activeSubscriptions: 0,
    eventsSent: 0,
    bytesSent: 0,
    disconnectCount: 0,
    heartbeatFailures: 0
  };

  incrementConnections() { this.metrics.activeConnections++; }
  decrementConnections() { 
    this.metrics.activeConnections = Math.max(0, this.metrics.activeConnections - 1); 
    this.metrics.disconnectCount++;
  }

  incrementSubscriptions() { this.metrics.activeSubscriptions++; }
  decrementSubscriptions() { this.metrics.activeSubscriptions = Math.max(0, this.metrics.activeSubscriptions - 1); }

  recordEventSent(byteSize: number) {
    this.metrics.eventsSent++;
    this.metrics.bytesSent += byteSize;
  }

  recordHeartbeatFailure() {
    this.metrics.heartbeatFailures++;
  }

  getMetrics(): RealtimeMetrics {
    return { ...this.metrics };
  }
}

export const realtimeMetrics = new MetricsCollector();
