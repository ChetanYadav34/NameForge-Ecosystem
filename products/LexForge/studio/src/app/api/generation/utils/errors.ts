import { error } from "./responses";
import { ServiceError, ValidationError, NotFoundError } from "../../../../lib/services/generation/errors";

export function handleApiError(err: unknown) {
  if (err instanceof ValidationError) {
    return error(err.message, err.code, 400, err.details);
  }

  if (err instanceof NotFoundError) {
    return error(err.message, err.code, 404, err.details);
  }

  if (err instanceof ServiceError) {
    // Other service errors default to 500 but might have specific codes
    if (err.code === "CONFLICT") {
      return error(err.message, err.code, 409, err.details);
    }
    return error(err.message, err.code, 500, err.details);
  }

  const message = err instanceof Error ? err.message : String(err);
  return error(message, "INTERNAL_ERROR", 500);
}
