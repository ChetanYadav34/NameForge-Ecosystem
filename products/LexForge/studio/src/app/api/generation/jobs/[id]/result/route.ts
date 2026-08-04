import { NextRequest } from "next/server";
import { generationService } from "../../../../../../lib/services/generation";
import { handleApiError } from "../../../utils/errors";
import { success } from "../../../utils/responses";
import { withMiddleware } from "../../../utils/middleware";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withMiddleware(req, async () => {
    try {
      const result = await generationService.getResult((await params).id);
      return success(result);
    } catch (err) {
      return handleApiError(err);
    }
  });
}
