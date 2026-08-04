"use client";
import { useState, useCallback } from "react";
import { generationClient } from "../api/generationClient";
import { useGenerationStore } from "../store/generationStore";
import { GenerationRequestDTO } from "../../services/generation/dto";

export function useGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const setJob = useGenerationStore((state) => state.setJob);
  const setSelectedJob = useGenerationStore((state) => state.setSelectedJob);

  const generate = useCallback(async (request: GenerationRequestDTO) => {
    setLoading(true);
    setError(null);
    try {
      const summary = await generationClient.createJob(request);
      setJob(summary);
      setSelectedJob(summary.id);
      return summary;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setJob, setSelectedJob]);

  return { generate, loading, error };
}

