import { StreamEvent } from "../../realtime/types";
import { ProgressDTO } from "../../services/generation/dto";
import { StreamDisconnectedError } from "../errors";

export class GenerationStream {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(
    private url: string,
    private onProgress: (progress: ProgressDTO) => void,
    private onStateChange: (state: "connecting" | "connected" | "disconnected") => void
  ) {}

  connect() {
    if (this.eventSource) this.disconnect();

    this.onStateChange("connecting");
    this.eventSource = new EventSource(this.url);

    this.eventSource.onopen = () => {
      this.reconnectAttempts = 0;
      this.onStateChange("connected");
    };

    this.eventSource.onmessage = (e) => {
      try {
        const event: StreamEvent<any> = JSON.parse(e.data);
        if (event.event === "ProgressUpdated") {
          this.onProgress(event.payload);
        } else if (event.event === "Heartbeat") {
          // Ignore heartbeats
        }
      } catch (err) {
        console.error("Failed to parse SSE event", err);
      }
    };

    this.eventSource.onerror = () => {
      this.eventSource?.close();
      this.onStateChange("disconnected");

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), 1000 * Math.pow(2, this.reconnectAttempts)); // Exponential backoff
      } else {
        console.error(new StreamDisconnectedError("Max reconnect attempts reached"));
      }
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.onStateChange("disconnected");
    }
  }
}
