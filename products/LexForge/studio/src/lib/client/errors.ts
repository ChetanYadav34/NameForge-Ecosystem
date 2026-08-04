export class ClientError extends Error {
  constructor(public code: string, message: string, public details?: any) {
    super(message);
    this.name = "ClientError";
  }
}

export class NetworkError extends ClientError {
  constructor(message: string, details?: any) {
    super("NETWORK_ERROR", message, details);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends ClientError {
  constructor(message: string = "Request timed out") {
    super("TIMEOUT", message);
    this.name = "TimeoutError";
  }
}

export class StreamDisconnectedError extends ClientError {
  constructor(message: string = "Stream disconnected unexpectedly") {
    super("STREAM_DISCONNECTED", message);
    this.name = "StreamDisconnectedError";
  }
}

export class ClientValidationError extends ClientError {
  constructor(message: string, details?: any) {
    super("VALIDATION_ERROR", message, details);
    this.name = "ClientValidationError";
  }
}
