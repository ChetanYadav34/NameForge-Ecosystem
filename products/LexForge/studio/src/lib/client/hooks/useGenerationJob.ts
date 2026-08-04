"use client";
import { useState, useCallback, useEffect } from "react";
import { generationClient } from "../api/generationClient";
import { useGenerationStore } from "../store/generationStore";
import { generationCache } from "../cache/generationCache";

export function useGenerationJob(jobId: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const job = useGenerationStore((state) => jobId ? state.jobs[jobId] : null);
  const setJob = useGenerationStore((state) => state.setJob);

  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    
    // Check cache first
    const cached = generationCache.get<typeof job>(`job:${jobId}`);
    if (cached) {
      setJob(cached);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const summary = await generationClient.getJob(jobId);
      generationCache.set(`job:${jobId}`, summary, 5000); // 5 sec TTL
      setJob(summary);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [jobId, setJob]);

  const cancel = useCallback(async () => {
    if (!jobId) return;
    await generationClient.cancelJob(jobId);
    await fetchJob();
  }, [jobId, fetchJob]);

  const pause = useCallback(async () => {
    if (!jobId) return;
    await generationClient.pauseJob(jobId);
    await fetchJob();
  }, [jobId, fetchJob]);

  const resume = useCallback(async () => {
    if (!jobId) return;
    await generationClient.resumeJob(jobId);
    await fetchJob();
  }, [jobId, fetchJob]);

  const restart = useCallback(async () => {
    if (!jobId) return;
    const newSummary = await generationClient.restartJob(jobId);
    setJob(newSummary);
    return newSummary;
  }, [jobId, setJob]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  return { job, loading, error, refresh: fetchJob, cancel, pause, resume, restart };
}

