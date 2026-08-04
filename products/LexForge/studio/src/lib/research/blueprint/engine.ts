import { CategorySignature } from "../intelligence/types";
import { CategoryBlueprint } from "./types";
import { blueprintAnalyzerRegistry } from "./registry";
import { BlueprintBuilder } from "./builders";

export class BlueprintEngine {
  build(signature: CategorySignature): CategoryBlueprint {
    const analyzers = blueprintAnalyzerRegistry.getAll();
    const builder = new BlueprintBuilder(analyzers);
    return builder.build(signature);
  }
}

export const blueprintEngine = new BlueprintEngine();
