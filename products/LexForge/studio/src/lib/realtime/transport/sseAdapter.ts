import { ClientConnection, StreamEvent } from "../types";

export class SSEAdapter implements ClientConnection {
  public id: string;
  private controller: ReadableStreamDefaultController;
  private encoder: TextEncoder;
  private disconnectHandlers: (() => void)[] = [];

  constructor(controller: ReadableStreamDefaultController) {
    this.id = crypto.randomUUID();
    this.controller = controller;
    this.encoder = new TextEncoder();
  }

  send(event: StreamEvent) {
    const payload = `data: ${JSON.stringify(event)}\n\n`;
    try {
      this.controller.enqueue(this.encoder.encode(payload));
    } catch (err) {
      this.close();
    }
  }

  close() {
    try {
      this.controller.close();
    } catch (e) {
      // Ignore if already closed
    } finally {
      this.triggerDisconnect();
    }
  }

  onDisconnect(callback: () => void) {
    this.disconnectHandlers.push(callback);
  }

  triggerDisconnect() {
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
