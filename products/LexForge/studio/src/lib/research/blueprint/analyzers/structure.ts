import { BlueprintAnalyzer, BlueprintFragment } from "../types";
import { CategorySignature } from "../../intelligence/types";

export class StructureAnalyzer implements BlueprintAnalyzer {
  id = "blueprint:analyzer:structure";
  name = "Structure Analyzer";

  analyze(signature: CategorySignature): BlueprintFragment[] {
    const fragments: BlueprintFragment[] = [];
    
    const coreStructs = signature.classifiedPatterns.structural.filter(p => p.classification === "core");
    if (coreStructs.length > 0) {
      fragments.push({
        type: "structure",
        data: { description: "Use strictly defined core CV structures." },
        trace: coreStructs
      });
    }

    return fragments;
  }
}
