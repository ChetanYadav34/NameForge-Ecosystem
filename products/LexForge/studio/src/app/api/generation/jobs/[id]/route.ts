import { NextRequest } from "next/server";
import { generationService } from "../../../../../lib/services/generation";
import { handleApiError } from "../../utils/errors";
import { success } from "../../utils/responses";
import { withMiddleware } from "../../utils/middleware";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withMiddleware(req, async () => {
    try {
      const summary = await generationService.getJob((await params).id);
      return success(summary);
    } catch (err) {
      return handleApiError(err);
    }
  });
}
