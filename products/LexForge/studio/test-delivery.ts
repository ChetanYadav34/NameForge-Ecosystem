import { generationClient } from "./src/lib/client/api/generationClient";

async function run() {
  console.log("Creating job...");
  // Use fully qualified URL for fetch in Node.js
  const client = generationClient;
  (client as any).baseUrl = "http://localhost:3000/api/generation";
  
  const job = await client.createJob({ seed: "Test", objective: "Test" });
  console.log("Job:", job.id);
  
  // Wait for it to finish
  let p = 0;
  while (p < 100) {
    await new Promise(r => setTimeout(r, 1000));
    const status = await client.getJob(job.id);
    console.log("Status:", status.status);
    if (status.status === "Completed") break;
    if (status.status === "Failed") break;
    p += 10;
  }
  
  const result = await client.getResult(job.id);
  console.log("Result Candidates Count:", result.candidates?.length);
  console.log("Result Metrics:", result.metrics);
  
  const explanation = await client.getExplanation(job.id);
  console.log("Explanation type:", explanation?.type);
  
  const artifacts = await client.getArtifacts(job.id);
  console.log("Artifacts count:", artifacts?.length);
  
  console.log("DONE");
}

run().catch(console.error);
