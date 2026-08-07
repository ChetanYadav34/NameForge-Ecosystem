import { 
  IntentIR, SemanticIR, MorphologicalIR, PhonologicalIR, OrthographicIR, CandidateIR 
} from "../models/ir";
import { ILanguagePlugin } from "../plugins/types";
import { ICorpusProvider } from "../providers/corpus";
import { ConstraintSolver } from "../constraints/engine";
import { SeededRNG } from "../utils/rng";
import { LinguisticCandidate } from "../models/types";

export interface PlannerContext {
  rng: SeededRNG;
  plugin: ILanguagePlugin;
  corpus: ICorpusProvider;
  solver: ConstraintSolver;
}

export interface IPlanner<InputIR, OutputIR> {
  readonly id: string;
  compile(input: InputIR, context: PlannerContext): OutputIR[];
}

/**
 * Registry for dynamic planners
 */
export class PlannerRegistry {
  private semanticPlanners: IPlanner<IntentIR, SemanticIR>[] = [];
  private morphologicalPlanners: IPlanner<SemanticIR, MorphologicalIR>[] = [];
  private phonologicalPlanners: IPlanner<MorphologicalIR, PhonologicalIR>[] = [];
  private orthographicPlanners: IPlanner<PhonologicalIR, OrthographicIR>[] = [];

  public registerSemantic(planner: IPlanner<IntentIR, SemanticIR>) { this.semanticPlanners.push(planner); }
  public registerMorphological(planner: IPlanner<SemanticIR, MorphologicalIR>) { this.morphologicalPlanners.push(planner); }
  public registerPhonological(planner: IPlanner<MorphologicalIR, PhonologicalIR>) { this.phonologicalPlanners.push(planner); }
  public registerOrthographic(planner: IPlanner<PhonologicalIR, OrthographicIR>) { this.orthographicPlanners.push(planner); }

  public getSemantic() { return this.semanticPlanners; }
  public getMorphological() { return this.morphologicalPlanners; }
  public getPhonological() { return this.phonologicalPlanners; }
  public getOrthographic() { return this.orthographicPlanners; }
}

/**
 * The rewritten MasterAssembler. 
 * Now acts strictly as the Pipeline Compiler Orchestrator.
 */
export class MasterAssembler {
  constructor(
    private registry: PlannerRegistry,
    private context: PlannerContext
  ) {}

  public compile(intent: IntentIR): LinguisticCandidate[] {
    const candidates: LinguisticCandidate[] = [];

    // Pass 1: Intent -> Semantic
    const semanticIRs = this.registry.getSemantic().flatMap(p => p.compile(intent, this.context));
    
    // Pass 2: Semantic -> Morphological
    const morphologicalIRs = semanticIRs.flatMap(s => 
      this.registry.getMorphological().flatMap(p => p.compile(s, this.context))
    );

    // Pass 3: Morphological -> Phonological (with Constraint Solver embedded in planner)
    const phonologicalIRs = morphologicalIRs.flatMap(m => 
      this.registry.getPhonological().flatMap(p => p.compile(m, this.context))
    );

    // Pass 4: Phonological -> Orthographic
    const orthographicIRs = phonologicalIRs.flatMap(p => 
      this.registry.getOrthographic().flatMap(pl => pl.compile(p, this.context))
    );

    // Pass 5: Candidate Formation
    for (const ortho of orthographicIRs) {
      candidates.push({
        id: crypto.randomUUID(),
        orthography: ortho.orthographyString,
        phonology: ortho.phonemes,
        syllables: ortho.syllables,
        scores: [],
        isValid: true,
        provenance: {
          jobId: intent.id,
          seed: intent.seed,
          versionLocks: {},
          steps: [{ phase: "Assembly", action: "Final Candidate Formed" }]
        }
      });
    }

    return candidates;
  }
}
