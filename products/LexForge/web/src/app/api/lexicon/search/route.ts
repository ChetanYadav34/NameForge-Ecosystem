import { NextRequest, NextResponse } from 'next/server';
import { SemanticClusterService } from '../../../../core/server/SemanticClusterService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const prompt = searchParams.get('prompt') || '';
  const industry = searchParams.get('industry') || '';
  const tone = searchParams.get('tone') || '';

  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  try {
    const service = new SemanticClusterService();
    const cluster = await service.generateCluster(prompt, industry, tone);
    
    return NextResponse.json({
      metadata: {
        timestamp: new Date().toISOString(),
        query: { prompt, industry, tone },
        totalRoots: cluster.length
      },
      cluster
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
