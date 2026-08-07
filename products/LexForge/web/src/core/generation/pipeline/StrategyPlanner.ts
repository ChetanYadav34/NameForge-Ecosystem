import { IndustryProfile, industryProfiles } from './IndustryProfile';
import { IGenerationStrategy } from '../strategies/IGenerationStrategy';
import { SemanticClusterRoot } from '../../server/SemanticClusterService';

export class StrategyPlanner {
  
  public planStrategies(industry: string, availableStrategies: IGenerationStrategy[]): IGenerationStrategy[] {
    const profile = industryProfiles[industry.toLowerCase()];
    
    if (!profile) {
      // Default behavior if no profile found
      return availableStrategies;
    }

    return availableStrategies.filter(strategy => {
      // Reject if banned
      if (profile.bannedStrategies.includes(strategy.name)) {
        return false;
      }
      return true;
    }).map(strategy => {
      // Increase weight if preferred
      if (profile.preferredStrategies.includes(strategy.name)) {
        // Return a wrapper object that implements the interface
        return {
          name: strategy.name,
          weight: strategy.weight * 1.5,
          generate: (ctx: any, cluster: any[], limit: number) => strategy.generate(ctx, cluster, limit)
        };
      }
      return strategy;
    }).sort((a, b) => b.weight - a.weight);
  }
}
