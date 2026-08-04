import { ClientConnection } from "../types";
import { heartbeatManager } from "./heartbeat";
import { realtimeMetrics } from "./metrics";
import { subscriptionManager } from "./subscriptionManager";

export class ConnectionManager {
  private connections = new Map<string, ClientConnection>();

  addConnection(client: ClientConnection) {
    this.connections.set(client.id, client);
    realtimeMetrics.incrementConnections();
    heartbeatManager.start(client);

    client.onDisconnect(() => {
      this.removeConnection(client.id);
    });
  }

  removeConnection(clientId: string) {
    if (this.connections.has(clientId)) {
      heartbeatManager.stop(clientId);
      this.connections.delete(clientId);
      realtimeMetrics.decrementConnections();
    }
  }

  // Bind a client to a specific job stream
  subscribeToJob(client: ClientConnection, jobId: string) {
    subscriptionManager.subscribeToJob(jobId, client);
  }

  // Bind a client to the global stream
  subscribeToAll(client: ClientConnection) {
    subscriptionManager.subscribeToAll(client);
  }
}

export const connectionManager = new ConnectionManager();
