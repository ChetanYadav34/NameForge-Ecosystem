import { BlueprintAnalyzer, BlueprintFragment } from "../types";
import { CategorySignature } from "../../intelligence/types";

export class MorphologyRuleAnalyzer implements BlueprintAnalyzer {
  id = "blueprint:analyzer:morphology";
  name = "Morphology Rule Analyzer";

  analyze(signature: CategorySignature): BlueprintFragment[] {
    const fragments: BlueprintFragment[] = [];
    
    const coreMorph = signature.classifiedPatterns.morphological.filter(p => p.classification === "core");
    if (coreMorph.length > 0) {
      fragments.push({
        type: "morphology",
        data: { description: "Prioritize core morphological derivations." },
        trace: coreMorph
      });
    }

    return fragments;
  }
}
