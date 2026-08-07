export interface GenerationContext {
  requestId: string;
  sessionId: string;
  originalPrompt: string;
  parsedIntent: string;
  industry: string;
  audience: string;
  tone: string;
  style: string;
  constraints: string[];
  requiredKeywords: string[];
  forbiddenKeywords: string[];
  language: string;
  pipelineVersion: string;
  engineVersion: string;
  datasetVersion: string;
  createdAt: number;
  executionTime: number;
  metadata: {
    targetEmotions?: string[];
    brandArchetypes?: string[];
    complexityLevel?: 'low' | 'medium' | 'high';
  };
}
