import { sessionEngine } from "./src/lib/research/session/engine";
import { GenerationRequest, CancellationToken } from "./src/lib/research/session/types";

async function runTest() {
  const prompt = process.argv[2] || "A modern fintech app";
  console.log("Starting test session with prompt:", prompt);
  
  const request = {
    category: "tech",
    prompt,
    seed: prompt,
    constraints: [],
    preferences: []
  } as unknown as GenerationRequest;

  const token = {
    isCancelled: false,
    cancel() {}
  } as unknown as CancellationToken;

  try {
    const start = Date.now();
    const result = await sessionEngine.executeSession(request, token);
    const duration = Date.now() - start;
    
    console.log(`Session completed in ${duration}ms.`);
    console.log("Status:", result.status);
    
    if (result.events) {
      const errorEvents = result.events.filter((e: any) => e.status === "failed");
      if (errorEvents.length > 0) {
        console.error("Pipeline Errors:", errorEvents);
        const vb = (result.artifacts as any).validatedBlueprint;
        if (vb && vb.status === "failed") {
          console.error("Validation Failed. Findings:", JSON.stringify(vb.reports, null, 2));
        }
      }
    }

    const artifacts = result.artifacts as any;
    console.log("Pipeline Data Flow Trace:");
    const stages = [
      { key: "candidateBatch", name: "Construction" },
      { key: "evaluatedCandidateBatch", name: "Evaluation" },
      { key: "filteredCandidateBatch", name: "Filtering" },
      { key: "rankedCandidateBatch", name: "Ranking" },
      { key: "diversifiedCandidateBatch", name: "Diversification" },
      { key: "selectedCandidateBatch", name: "Selection" },
      { key: "explainedCandidateBatch", name: "Explanation" },
      { key: "CANDIDATES", name: "Output" }
    ];
    for (const stage of stages) {
      if (artifacts[stage.key] && artifacts[stage.key].candidates) {
        const batch = artifacts[stage.key];
        console.log(`[${stage.key}] count: ${batch.candidates.length}`);
        
        if (batch.candidates.length > 0) {
          const sample = batch.candidates[0];
          console.log(`  Sample:`, JSON.stringify(sample, null, 2).substring(0, 500) + "...");
          
          if (stage.key === "CANDIDATES") {
            console.log(`  Metadata:`, JSON.stringify(sample.metadata));
            console.log(`  Explanation:`, sample.explanation?.summary);
          }
        }
      }
    }
  } catch (error) {
    console.error("Session threw error:", error);
  }
}

runTest();
