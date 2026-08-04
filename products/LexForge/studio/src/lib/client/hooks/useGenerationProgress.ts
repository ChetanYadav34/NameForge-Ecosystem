"use client";
import { useEffect, useState } from "react";
import { useGenerationStore } from "../store/generationStore";
import { GenerationStream } from "../realtime/generationStream";

export function useGenerationProgress(jobId: string | null) {
  const [error, setError] = useState<Error | null>(null);
  
  const progress = useGenerationStore((state) => jobId ? state.progress[jobId] : null);
  const setProgress = useGenerationStore((state) => state.setProgress);

  useEffect(() => {
    if (!jobId) return;

    setError(null);

    const stream = new GenerationStream(
      `/api/generation/jobs/${jobId}/stream`,
      (newProgress) => {
        setProgress(jobId, newProgress);
      },
      (state) => {
        if (state === "disconnected" && !stream) {
          // If disconnected naturally, we might not set error
        }
      }
    );

    stream.connect();

    return () => {
      stream.disconnect();
    };
  }, [jobId, setProgress]);

  return { progress, error };
}

