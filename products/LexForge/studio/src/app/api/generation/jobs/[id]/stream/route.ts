import { NextRequest } from "next/server";
import { eventHub } from "../../../../../../lib/realtime";
import { SSEAdapter } from "../../../../../../lib/realtime/transport/sseAdapter";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Setup SSE stream
  let controller: ReadableStreamDefaultController;
  const stream = new ReadableStream({
    start(c) {
      controller = c;
    },
    cancel() {
      // Disconnect handled by the adapter closing
    }
  });

  const adapter = new SSEAdapter(controller!);
  eventHub.registerJobClient(id, adapter);

  req.signal.addEventListener("abort", () => {
    adapter.triggerDisconnect();
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}
