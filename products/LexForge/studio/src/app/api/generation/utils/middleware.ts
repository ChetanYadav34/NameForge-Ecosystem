import { NextRequest } from "next/server";

export async function withMiddleware(req: NextRequest, handler: () => Promise<Response>): Promise<Response> {
  // Placeholder for future auth/rate limiting
  // e.g. check Authorization header
  // if (!isValid(req)) throw new UnauthorizedError();
  
  return handler();
}
