import { ExplainedCandidate } from './ExplanationService';
import { GenerationResult } from '../../../store/useGenerationStore';

export class ResultFormatter {
  public format(candidates: ExplainedCandidate[], context: any): GenerationResult[] {
    return candidates.map((c, index) => {
      // Capitalize first letter
      const name = c.word.charAt(0).toUpperCase() + c.word.slice(1);
      
      return {
        id: crypto.randomUUID(),
        name,
        pronunciation: `/${c.word.toLowerCase()}/`, // Mocked IPA for now
        meaning: c.explanations.meaning,
        linguisticRoot: c.explanations.rootBreakdown,
        culturalContext: c.explanations.psychologicalReasoning,
        semanticScore: c.score?.semanticScore || 80,
        brandScore: c.score?.industryScore || 80,
        availability: Math.random() > 0.5,
        // Future extensions as requested
        domainStatus: 'UNKNOWN',
        trademarkStatus: 'UNKNOWN',
        socialHandleStatus: 'UNKNOWN',
        collisionRisk: 'LOW',
        reasoning: c.explanations.brandabilityExplanation,
        generationStrategy: c.provenance?.strategyName || 'Unknown',
        engineVersion: '2.0.0',
        pipelineVersion: '2.0.0',
        datasetVersion: 'v2',
        emotionProfile: { trust: 80, luxury: 70 },
        brandArchetype: 'Creator',
        phoneticScore: c.score?.phoneticScore || 80,
        psychologyScore: 85,
        originalityScore: 85,
        confidence: c.score?.totalScore || 80
      } as GenerationResult;
    });
  }
}
