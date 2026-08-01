import { EventType, EventPayloadMap } from "./types";

export interface StudioEvent<T extends EventType> {
  type: T;
  payload: EventPayloadMap[T];
  timestamp: number;
}

type EventHandler<T extends EventType> = (event: StudioEvent<T>) => void;

class EventBus {
  private handlers = new Map<EventType, Set<EventHandler<any>>>();

  public subscribe<T extends EventType>(type: T, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(type);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(type);
        }
      }
    };
  }

  public publish<T extends EventType>(type: T, payload: EventPayloadMap[T]): void {
    const handlers = this.handlers.get(type);
    
    if (handlers) {
      const event: StudioEvent<T> = {
        type,
        payload,
        timestamp: Date.now()
      };
      
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`[EventBus] Error in handler for ${type}:`, error);
        }
      });
    }
  }
}

export const coreEvents = new EventBus();
