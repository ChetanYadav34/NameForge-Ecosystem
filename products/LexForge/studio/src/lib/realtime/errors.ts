export class RealtimeError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "RealtimeError";
  }
}
