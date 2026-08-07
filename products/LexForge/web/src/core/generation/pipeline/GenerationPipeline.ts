import { InputParserService } from '../services/InputParserService';
import { CandidateGenerationService } from '../services/CandidateGenerationService';
import { CandidateFilteringService } from '../services/CandidateFilteringService';
import { ScoringEngine } from '../services/ScoringEngine';
import { RankingEngine } from '../services/RankingEngine';
import { QualityGateService } from '../services/QualityGateService';
import { ExplanationService } from '../services/ExplanationService';
import { ResultFormatter } from '../services/ResultFormatter';
import { ResearchLogger } from '../services/ResearchLogger';
import { Registry } from '../providers/ProviderRegistry';
import { DictionaryProvider } from '../providers/DictionaryProvider';
import { PsychologyProvider, RankingProvider } from '../providers/OtherProviders';
import { GenerationResult } from '../../../store/useGenerationStore';
import { InteractionEventBus } from '../../events/EventBus';
import { GenerationContext } from '../context/GenerationContext';

export class GenerationPipeline {
  private parser = new InputParserService();
  private generator = new CandidateGenerationService();
  private filterService = new CandidateFilteringService();
  private scorer = new ScoringEngine();
  private ranker = new RankingEngine();
  private gate = new QualityGateService();
  private explainer = new ExplanationService();
  private formatter = new ResultFormatter();
  private logger = new ResearchLogger();

  public async initialize(): Promise<void> {
    // Register all providers
    Registry.register(new DictionaryProvider());
    Registry.register(new PsychologyProvider());
    Registry.register(new RankingProvider());
    // (Phonetic and Ontology are not implemented yet in the mock files, but these are the ones we have)
    
    // Log registration
    console.log('[GenerationPipeline] Registered Providers:', Array.from((Registry as any).providers?.keys() || []));

    await Registry.initializeAll();
    console.log('[GenerationPipeline] All Providers Initialized');
  }

  public async run(input: string, industry: string, tone: string): Promise<void> {
    const startTime = Date.now();
    
    // 1. Parsing & Context
    InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'INPUT_PARSING' });
    const context = this.parser.parse(input, industry, tone);
    await this.delay(300);

    // 2. Generation
    InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'GENERATING' });
    const rawCandidates = await this.generator.generateCandidates(context, 100);
    console.log(`[GenerationPipeline] Generated Candidates:`, rawCandidates.length);
    await this.delay(300);

    // 3. Filtering
    InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'FILTERING' });
    const filteredCandidates = this.filterService.filter(rawCandidates);
    console.log(`[GenerationPipeline] Filtered Candidates:`, filteredCandidates.length);
    await this.delay(300);

    // 4. Scoring
    InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'EVALUATING' });
    const scoredCandidates = this.scorer.score(filteredCandidates);
    await this.delay(300);

    // 5. Ranking
    InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'RANKING' });
    const rankedCandidates = this.ranker.rank(scoredCandidates, context);
    await this.delay(300);

    // 6. Quality Gate
    const topCandidates = this.gate.filter(rankedCandidates, 75).slice(0, 8); // top 8

    // 7. Explanation
    InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'FINALIZING' });
    const explained = this.explainer.explain(topCandidates);
    await this.delay(300);

    // 8. Formatting
    const finalResults = this.formatter.format(explained, context);

    // 9. Streaming to UI
    InteractionEventBus.emit('STREAM_STARTED', { timestamp: Date.now() });
    for (const res of finalResults) {
      await this.delay(100);
      InteractionEventBus.emit('STREAM_CHUNK', { chunk: JSON.stringify(res), timestamp: Date.now() });
    }
    InteractionEventBus.emit('STREAM_FINISHED', { resultId: 'batch-complete', timestamp: Date.now() });

    // 10. Logging
    const executionTime = Date.now() - startTime;
    this.logger.logRun(
      context, 
      rawCandidates.length, 
      filteredCandidates.length, 
      rankedCandidates.length - topCandidates.length, 
      finalResults.length,
      executionTime
    );
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
