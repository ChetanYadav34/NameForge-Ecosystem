import { NextRequest } from "next/server";
import { generationService } from "../../../lib/services/generation";
import { GenerationRequestDTO } from "../../../lib/services/generation/dto";
import { handleApiError } from "./utils/errors";
import { success } from "./utils/responses";
import { parseJsonBody } from "./utils/validation";
import { withMiddleware } from "./utils/middleware";

export async function POST(req: NextRequest) {
  return withMiddleware(req, async () => {
    try {
      const dto = await parseJsonBody<GenerationRequestDTO>(req);
      const summary = await generationService.createGeneration(dto);
      return success(summary, 201);
    } catch (err) {
      return handleApiError(err);
    }
  });
}
