export interface StreamEvent<T = any> {
  eventId: string;
  version: string;
  timestamp: string;
  event: string;
  payload: T;
}

export interface ClientConnection {
  id: string;
  send(event: StreamEvent): void;
  close(): void;
  onDisconnect(callback: () => void): void;
}

export interface RealtimeMetrics {
  activeConnections: number;
  activeSubscriptions: number;
  eventsSent: number;
  bytesSent: number;
  disconnectCount: number;
  heartbeatFailures: number;
}
