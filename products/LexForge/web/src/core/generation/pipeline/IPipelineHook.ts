import { GenerationContext } from '../context/GenerationContext';

export interface IPipelineHook {
  onBeforeParsing?(prompt: string): void;
  onAfterParsing?(context: GenerationContext): void;
  
  onBeforeGeneration?(context: GenerationContext): void;
  onAfterGeneration?(context: GenerationContext, candidatesCount: number): void;
  
  onBeforeFiltering?(candidatesCount: number): void;
  onAfterFiltering?(filteredCount: number, rejectedCount: number): void;
  
  onBeforeScoring?(): void;
  onAfterScoring?(): void;
  
  onBeforeRanking?(): void;
  onAfterRanking?(): void;
  
  onBeforeFormatting?(): void;
  onAfterFormatting?(): void;

  onPhaseStart?(phaseName: string): void;
  onCandidateGenerated?(candidate: any): void;
  onEvaluationComplete?(candidates: any[]): void;
}
