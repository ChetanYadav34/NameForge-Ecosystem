import { PhonologicalIR, OrthographicIR } from "../models/ir";
import { IPlanner, PlannerContext } from "./assembler";

export class OrthographyPlanner implements IPlanner<PhonologicalIR, OrthographicIR> {
  public readonly id = "planner:orthography:baseline";

  public compile(input: PhonologicalIR, context: PlannerContext): OrthographicIR[] {
    // Map phonemes to string using the active Language Plugin
    const orthographyString = context.plugin.mapOrthography(input.phonemeSequence);

    // Capitalize first letter
    const formatted = orthographyString.charAt(0).toUpperCase() + orthographyString.slice(1);

    return [{
      id: crypto.randomUUID(),
      sourcePhonologicalId: input.id,
      phonemes: input.phonemeSequence,
      syllables: input.syllables,
      graphemeSequence: [], // Future mapping goes here
      orthographyString: formatted
    }];
  }
}
