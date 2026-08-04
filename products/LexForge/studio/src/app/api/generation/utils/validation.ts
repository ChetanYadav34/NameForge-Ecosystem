import { NextRequest } from "next/server";
import { ValidationError } from "../../../../lib/services/generation/errors";

export async function parseJsonBody<T>(req: NextRequest): Promise<T> {
  try {
    const body = await req.json();
    return body as T;
  } catch (err) {
    throw new ValidationError("Invalid JSON payload");
  }
}
