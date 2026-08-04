import { GenerationSequence, GenerationInstruction, GenerationConstraint } from "../types";

export class SequenceBuilder {
  build(
    structures: GenerationInstruction[],
    flows: GenerationInstruction[],
    constraints: GenerationConstraint[]
  ): GenerationSequence {
    return {
      stages: [
        {
          id: "stage:1",
          name: "Base Structure Generation",
          instructions: structures
        },
        {
          id: "stage:2",
          name: "Phonetic Flow Application",
          instructions: flows
        }
      ]
    };
  }
}
