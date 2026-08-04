import { NextRequest, NextResponse } from "next/server";
import { generationService } from "../../../../../../../../lib/services/generation";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string, type: string }> }) {
  try {
    const { id, type } = await params;
    const artifacts = await generationService.downloadArtifacts(id);
    
    const artifact = artifacts.find((a: any) => a.type === type);
    
    if (!artifact) {
      return NextResponse.json({ error: { message: "Artifact not found", code: "NOT_FOUND" } }, { status: 404 });
    }

    const payload = JSON.stringify(artifact.data, null, 2);
    const size = new TextEncoder().encode(payload).length;

    return new NextResponse(payload, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${type.replace(/[^a-zA-Z0-9_-]/g, '_')}_${id}.json"`,
        "Content-Length": size.toString()
      }
    });
  } catch (err) {
    return NextResponse.json({ error: { message: err instanceof Error ? err.message : "Internal Error" } }, { status: 500 });
  }
}
