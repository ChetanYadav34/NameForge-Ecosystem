import { BlueprintAnalyzer, BlueprintFragment } from "../types";
import { CategorySignature } from "../../intelligence/types";

export class ConstraintAnalyzer implements BlueprintAnalyzer {
  id = "blueprint:analyzer:constraint";
  name = "Constraint Analyzer";

  analyze(signature: CategorySignature): BlueprintFragment[] {
    const fragments: BlueprintFragment[] = [];
    
    // Noise patterns become negative constraints
    const noisePatterns = [
      ...signature.classifiedPatterns.orthographic,
      ...signature.classifiedPatterns.structural
    ].filter(p => p.classification === "noise");

    if (noisePatterns.length > 0) {
      fragments.push({
        type: "constraint",
        data: { description: "Avoid rare/noise structures and characters." },
        trace: noisePatterns
      });
    }

    return fragments;
  }
}
