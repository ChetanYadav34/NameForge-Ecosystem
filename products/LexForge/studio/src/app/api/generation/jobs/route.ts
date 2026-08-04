import { NextRequest } from "next/server";
import { generationService } from "../../../../lib/services/generation";
import { handleApiError } from "../utils/errors";
import { success } from "../utils/responses";
import { withMiddleware } from "../utils/middleware";

export async function GET(req: NextRequest) {
  return withMiddleware(req, async () => {
    try {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get("page") || "1", 10);
      const pageSize = parseInt(url.searchParams.get("pageSize") || "50", 10);

      const result = await generationService.listJobs({ page, pageSize });
      return success(result);
    } catch (err) {
      return handleApiError(err);
    }
  });
}
