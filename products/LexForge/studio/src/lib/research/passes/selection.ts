import { ResearchContext, ResearchPass } from "../types";
import { DatasetRepository } from "@/lib/dataset/repository";

export class VocabularySelectionPass implements ResearchPass {
  id = "pass:vocabulary-selection";
  name = "Vocabulary Selection Pass";
  priority = 700;

  async execute(context: ResearchContext): Promise<void> {
    const startTime = performance.now();
    let accepted = 0;
    let rejected = 0;

    // A simple threshold config. Eventually this comes from SelectionPolicy
    const CONFIDENCE_THRESHOLD = 0.5; 

    // Sort by ranking before splitting
    const sortedCandidates = Array.from(context.candidatePool.values())
      .sort((a, b) => b.rankingScore - a.rankingScore);

    for (const candidate of sortedCandidates) {
      if (candidate.overallConfidence >= CONFIDENCE_THRESHOLD) {
        candidate.status = "accepted";
        
        // We resolve LexEntry for accepted candidates
        const entry = await DatasetRepository.findWord(candidate.term);
        if (entry) {
          candidate.lexEntry = entry;
          context.acceptedVocabulary.push(candidate);
          accepted++;
        } else {
          // If it doesn't exist in the dataset, we can't fully construct a node later.
          // Still, it might be a valid string, but we reject it for the formal graph.
          candidate.status = "rejected";
          context.rejectedVocabulary.push(candidate);
          rejected++;
        }
      } else {
        candidate.status = "rejected";
        context.rejectedVocabulary.push(candidate);
        rejected++;
      }
    }

    const duration = performance.now() - startTime;
    context.session.executionMetrics[this.id] = {
      durationMs: duration,
      accepted,
      rejected
    };
    
    context.session.statistics["accepted_vocabulary"] = accepted;
    context.session.statistics["rejected_vocabulary"] = rejected;
  }
}
