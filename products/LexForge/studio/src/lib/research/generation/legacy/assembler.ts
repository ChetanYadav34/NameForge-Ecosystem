import { CandidateAssembler, CandidateFragment, Candidate } from "../types";

export class MasterAssembler implements CandidateAssembler {
  assemble(fragments: CandidateFragment[]): Candidate[] {
    // Mock assembly logic. Real implementation would traverse fragments
    // and attempt to stitch them into strings adhering to CV structures.
    if (fragments.length === 0) return [];

    let value = fragments.map(f => f.value).join("");
    if (value.length > 8) {
      value = value.substring(0, 8); // Truncate to pass length constraints
    }
    
    return [
      {
        id: crypto.randomUUID(),
        value,
        fragments,
        metadata: {
          assembledBy: "MasterAssembler"
        }
      }
    ];
  }
}
