import { ClientConnection, StreamEvent } from "../types";

// This is a placeholder structure for when WebSocket is integrated
export class WebSocketAdapter implements ClientConnection {
  public id: string;
  private ws: any; // e.g. WebSocket instance
  private disconnectHandlers: (() => void)[] = [];

  constructor(ws: any) {
    this.id = crypto.randomUUID();
    this.ws = ws;

    this.ws.on("close", () => {
      this.triggerDisconnect();
    });

    this.ws.on("error", () => {
      this.close();
    });
  }

  send(event: StreamEvent) {
    if (this.ws.readyState === 1 /* OPEN */) {
      try {
        this.ws.send(JSON.stringify(event));
      } catch (err) {
        this.close();
      }
    } else {
      this.close();
    }
  }

  close() {
    try {
      this.ws.close();
    } catch (e) {
      // Ignore
    } finally {
      this.triggerDisconnect();
    }
  }

  onDisconnect(callback: () => void) {
    this.disconnectHandlers.push(callback);
  }

  private triggerDisconnect() {
    for (const handler of this.disconnectHandlers) {
      try {
        handler();
      } catch (e) {
        // Ignore handler errors
      }
    }
    this.disconnectHandlers = [];
  }
}
