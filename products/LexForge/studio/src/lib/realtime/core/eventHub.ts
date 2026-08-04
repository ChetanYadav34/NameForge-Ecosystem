import { connectionManager } from "./connectionManager";
import { realtimeMetrics } from "./metrics";
import { ClientConnection } from "../types";

export class EventHub {
  registerGlobalClient(client: ClientConnection) {
    connectionManager.addConnection(client);
    connectionManager.subscribeToAll(client);
  }

  registerJobClient(jobId: string, client: ClientConnection) {
    connectionManager.addConnection(client);
    connectionManager.subscribeToJob(client, jobId);
  }

  getMetrics() {
    return realtimeMetrics.getMetrics();
  }
}

export const eventHub = new EventHub();
