import { NextRequest } from "next/server";
import { generationService } from "../../../../../../lib/services/generation";
import { handleApiError } from "../../../utils/errors";
import { success } from "../../../utils/responses";
import { withMiddleware } from "../../../utils/middleware";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withMiddleware(req, async () => {
    try {
      await generationService.resumeJob((await params).id);
      return success({ message: "Job resumed successfully" });
    } catch (err) {
      return handleApiError(err);
    }
  });
}
