import { GenerationContext } from '../context/GenerationContext';

export class ResearchLogger {
  public logRun(
    context: GenerationContext, 
    generatedCount: number, 
    filteredCount: number, 
    rejectedCount: number, 
    finalCount: number, 
    executionTimeMs: number
  ) {
    // In a real production system, this would write to a database or analytics pipeline.
    // For now, we simply console.log to demonstrate the architectural decoupling.
    console.group(`[LexForge Engine] Run: ${context.sessionId}`);
    console.log(`Prompt: "${context.originalPrompt}"`);
    console.log(`Industry: ${context.industry} | Tone: ${context.tone}`);
    console.log(`Candidates Generated: ${generatedCount}`);
    console.log(`Candidates Post-Filtering: ${filteredCount}`);
    console.log(`Candidates Rejected by Quality Gate: ${rejectedCount}`);
    console.log(`Final Candidates Selected: ${finalCount}`);
    console.log(`Execution Time: ${executionTimeMs}ms`);
    console.groupEnd();
  }
}
