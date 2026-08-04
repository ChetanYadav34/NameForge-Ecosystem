export class ServiceError extends Error {
  constructor(public code: string, message: string, public details?: any) {
    super(message);
    this.name = "ServiceError";
  }
}

export class ValidationError extends ServiceError {
  constructor(message: string, details?: any) {
    super("VALIDATION_ERROR", message, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends ServiceError {
  constructor(resource: string, id: string) {
    super("NOT_FOUND", `${resource} with ID ${id} was not found`);
    this.name = "NotFoundError";
  }
}
