export interface GenerationClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
}

export interface ClientStreamOptions {
  onMessage?: (payload: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}
