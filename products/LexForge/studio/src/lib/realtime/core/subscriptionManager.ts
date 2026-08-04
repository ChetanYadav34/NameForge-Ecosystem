import { generationService } from "../../services/generation";
import { ProgressDTO } from "../../services/generation/dto";
import { ClientConnection } from "../types";
import { realtimeMetrics } from "./metrics";

export class SubscriptionManager {
  // Map of jobId -> array of connected clients subscribed to it
  private jobSubscriptions = new Map<string, Set<ClientConnection>>();
  // Map of jobId -> unsubscribe function from generationService
  private serviceListeners = new Map<string, () => void>();
  // Global subscribers (listening to ALL jobs)
  private globalSubscribers = new Set<ClientConnection>();

  subscribeToJob(jobId: string, client: ClientConnection) {
    if (!this.jobSubscriptions.has(jobId)) {
      this.jobSubscriptions.set(jobId, new Set());
      this.mountServiceListener(jobId);
    }
    this.jobSubscriptions.get(jobId)!.add(client);
    realtimeMetrics.incrementSubscriptions();

    client.onDisconnect(() => {
      this.unsubscribeFromJob(jobId, client);
    });
  }

  subscribeToAll(client: ClientConnection) {
    this.globalSubscribers.add(client);
    realtimeMetrics.incrementSubscriptions();

    client.onDisconnect(() => {
      this.globalSubscribers.delete(client);
      realtimeMetrics.decrementSubscriptions();
    });
  }

  private unsubscribeFromJob(jobId: string, client: ClientConnection) {
    const subs = this.jobSubscriptions.get(jobId);
    if (subs) {
      subs.delete(client);
      realtimeMetrics.decrementSubscriptions();
      if (subs.size === 0) {
        this.jobSubscriptions.delete(jobId);
        this.unmountServiceListener(jobId);
      }
    }
  }

  private mountServiceListener(jobId: string) {
    const unsub = generationService.subscribeToProgress(jobId, (progress: ProgressDTO) => {
      this.broadcast(jobId, progress);
    });
    this.serviceListeners.set(jobId, unsub);
  }

  private unmountServiceListener(jobId: string) {
    const unsub = this.serviceListeners.get(jobId);
    if (unsub) {
      unsub();
      this.serviceListeners.delete(jobId);
    }
  }

  private broadcast(jobId: string, progress: ProgressDTO) {
    const event = {
      eventId: crypto.randomUUID(),
      version: "1.0",
      timestamp: new Date().toISOString(),
      event: "ProgressUpdated",
      payload: progress
    };

    const eventJson = JSON.stringify(event);
    const size = new Blob([eventJson]).size;

    // Send to specific job subscribers
    const jobSubs = this.jobSubscriptions.get(jobId);
    if (jobSubs) {
      for (const client of jobSubs) {
        this.trySend(client, event, size);
      }
    }

    // Send to global subscribers
    for (const client of this.globalSubscribers) {
      this.trySend(client, event, size);
    }
  }

  private trySend(client: ClientConnection, event: any, size: number) {
    try {
      client.send(event);
      realtimeMetrics.recordEventSent(size);
    } catch (err) {
      // If a client fails to receive, we close it and rely on disconnect handlers
      client.close();
    }
  }
}

export const subscriptionManager = new SubscriptionManager();
