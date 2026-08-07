export interface BenchmarkPrompt {
  id: string;
  seed: string;
  description: string;
  targetArchetype: "luxury" | "tech" | "healthcare" | "finance" | "nature" | "ai" | "energy";
}

export const BENCHMARK_PROMPTS: BenchmarkPrompt[] = [
  { id: "bench-ai-1", seed: "ai-seed-001", description: "AI startup", targetArchetype: "ai" },
  { id: "bench-lux-1", seed: "lux-seed-001", description: "Luxury fashion", targetArchetype: "luxury" },
  { id: "bench-health-1", seed: "hlt-seed-001", description: "Healthcare", targetArchetype: "healthcare" },
  { id: "bench-cyber-1", seed: "cyb-seed-001", description: "Cybersecurity", targetArchetype: "tech" },
  { id: "bench-fin-1", seed: "fin-seed-001", description: "Fintech", targetArchetype: "finance" },
];
