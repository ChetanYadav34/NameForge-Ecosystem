import { GenerationContext } from '../context/GenerationContext';
import { CandidateWord, IGenerationStrategy } from '../strategies/IGenerationStrategy';

import { LatinStrategy } from '../strategies/LatinStrategy';
import { RootMergeStrategy } from '../strategies/RootMergeStrategy';
import { StrategyPlanner } from '../pipeline/StrategyPlanner';
import { SemanticProvider } from '../providers/SemanticProvider';
import { InteractionEventBus } from '../../events/EventBus';

export class CandidateGenerationService {
  private strategies: IGenerationStrategy[] = [];

  constructor() {
    this.strategies.push(new LatinStrategy());
    this.strategies.push(new RootMergeStrategy());
  }

  public async generateCandidates(context: GenerationContext, limit: number = 20): Promise<CandidateWord[]> {
    InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'EVALUATING' });
    
    // 1. Fetch semantic cluster
    const semanticProvider = new SemanticProvider();
    const cluster = await semanticProvider.getCluster(context);
    
    if (!cluster || cluster.length === 0) {
      console.warn("Semantic cluster returned empty.");
    }

    // 2. Plan Strategies based on Industry Profile
    const planner = new StrategyPlanner();
    const plannedStrategies = planner.planStrategies(context.industry, this.strategies);

    // 3. Execute Strategies using immutable inputs
    const allCandidates: CandidateWord[] = [];
    const promises = plannedStrategies.map(async (strategy) => {
      try {
        const stratCandidates = await strategy.generate(context, cluster, Math.ceil(limit / plannedStrategies.length));
        
        // Strategy only combines roots. It stamps Provenance. We assign confidence here if missing.
        return stratCandidates.map(c => {
          if (!c.score) {
            c.score = {
              semanticScore: 0.8,
              phoneticScore: 0.8,
              industryScore: 0.8,
              totalScore: 0.8
            };
          }
          return c;
        });
      } catch (error) {
        console.warn(`Strategy ${strategy.name} failed:`, error);
        return [];
      }
    });

    const results = await Promise.all(promises);
    results.forEach(res => allCandidates.push(...res));

    return allCandidates;
  }
}
