import { BlueprintAnalyzer, BlueprintFragment } from "../types";
import { CategorySignature } from "../../intelligence/types";

export class FlowAnalyzer implements BlueprintAnalyzer {
  id = "blueprint:analyzer:flow";
  name = "Flow Analyzer";

  analyze(signature: CategorySignature): BlueprintFragment[] {
    const fragments: BlueprintFragment[] = [];
    
    const dominantFlows = signature.classifiedPatterns.transition.filter(p => p.classification === "dominant" || p.classification === "core");
    if (dominantFlows.length > 0) {
      fragments.push({
        type: "flow",
        data: { description: "Maintain dominant category phonetic flows." },
        trace: dominantFlows
      });
    }

    return fragments;
  }
}
