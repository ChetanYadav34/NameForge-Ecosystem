type EventMap = Record<string, any>;

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

interface IEventBus<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
}

export class EventBus<T extends EventMap> implements IEventBus<T> {
  private listeners: { [K in keyof EventMap]?: Array<EventReceiver<EventMap[K]>> } = {};

  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName]!.push(fn);
  }

  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    const eventListeners = this.listeners[eventName];
    if (eventListeners) {
      this.listeners[eventName] = eventListeners.filter((listener) => listener !== fn);
    }
  }

  emit<K extends EventKey<T>>(eventName: K, params: T[K]) {
    const eventListeners = this.listeners[eventName];
    if (eventListeners) {
      eventListeners.forEach((fn) => fn(params));
    }
  }
}

export type LexForgeEvents = {
  INPUT_RECEIVED: { value: string; timestamp: number };
  SEED_ADDED: { type: string; value: string; timestamp: number };
  SEED_REMOVED: { id: string; timestamp: number };
  VALIDATION_STARTED: { timestamp: number };
  VALIDATION_FAILED: { reason: string; timestamp: number };
  GENERATION_STARTED: { timestamp: number };
  STREAM_STARTED: { timestamp: number };
  STREAM_CHUNK: { chunk: string; timestamp: number };
  STREAM_FINISHED: { resultId: string; timestamp: number };
  FSM_STATE_CHANGE: { state: string };
  RESULT_SELECTED: { resultId: string; timestamp: number };
  RESULT_SAVED: { resultId: string; timestamp: number };
  COMPARE_ADDED: { resultId: string; timestamp: number };
  COMPARE_REMOVED: { resultId: string; timestamp: number };
  THEME_CHANGED: { theme: 'light' | 'dark' | 'system'; timestamp: number };
  MODAL_OPENED: { modalId: string; timestamp: number };
  MODAL_CLOSED: { modalId: string; timestamp: number };
};

export const InteractionEventBus = new EventBus<LexForgeEvents>();
