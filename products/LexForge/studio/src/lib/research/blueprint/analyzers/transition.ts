import { BlueprintAnalyzer, BlueprintFragment } from "../types";
import { CategorySignature } from "../../intelligence/types";

export class TransitionRuleAnalyzer implements BlueprintAnalyzer {
  id = "blueprint:analyzer:transition";
  name = "Transition Rule Analyzer";

  analyze(signature: CategorySignature): BlueprintFragment[] {
    const fragments: BlueprintFragment[] = [];
    
    const dominantTransitions = signature.classifiedPatterns.transition.filter(p => p.classification === "dominant");
    if (dominantTransitions.length > 0) {
      fragments.push({
        type: "transition",
        data: { description: "Use strictly permitted transitions." },
        trace: dominantTransitions
      });
    }

    return fragments;
  }
}
