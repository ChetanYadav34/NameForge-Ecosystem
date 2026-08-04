import { GenerationObjective } from "../types";

export class ObjectiveBuilder {
  build(domain: string, styleTarget: string, primaryFocus: GenerationObjective["primaryFocus"]): GenerationObjective {
    return {
      domain,
      styleTarget,
      primaryFocus
    };
  }
}
