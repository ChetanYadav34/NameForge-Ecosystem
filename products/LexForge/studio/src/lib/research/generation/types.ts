import { GenerationPlan, GenerationInstruction } from "../strategy/types";

export interface ConstructionTrace {
  instruction: GenerationInstruction;
}

export interface CandidateFragment extends ConstructionTrace {
  id: string;
  type: string;
  value: string;
}

export interface Candidate {
  id: string;
  value: string;
  fragments: CandidateFragment[];
  metadata: Record<string, any>;
}

export interface CandidateBatch {
  id: string;
  sourcePlanId: string;
  candidates: Candidate[];
  generatedAt: string;
}

export interface ConstructionInstruction {
  type: string;
  execute(fragments: CandidateFragment[]): CandidateFragment[];
}

export interface ConstructionStage {
  id: string;
  name: string;
  builders: CandidateBuilder[];
}

export interface GenerationRuntime {
  plan: GenerationPlan;
  currentFragments: CandidateFragment[];
}

export interface CandidateBuilder {
  id: string;
  name: string;
  build(runtime: GenerationRuntime): CandidateFragment[];
}

export interface CandidateAssembler {
  assemble(fragments: CandidateFragment[]): Candidate[];
}
