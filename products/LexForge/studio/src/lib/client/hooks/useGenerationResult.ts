"use client";
import { useState, useCallback, useEffect } from "react";
import { generationClient } from "../api/generationClient";
import { useGenerationStore } from "../store/generationStore";
import { generationCache } from "../cache/generationCache";
import { ArtifactDTO } from "../../services/generation/dto";

export function useGenerationResult(jobId: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const result = useGenerationStore((state) => jobId ? state.results[jobId] : null);
  const setResult = useGenerationStore((state) => state.setResult);

  const fetchResult = useCallback(async () => {
    if (!jobId) return;

    const cached = generationCache.get<typeof result>(`result:${jobId}`);
    if (cached) {
      setResult(jobId, cached);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await generationClient.getResult(jobId);
      generationCache.set(`result:${jobId}`, data, 60000); // 60s TTL
      setResult(jobId, data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [jobId, setResult]);

  const fetchExplanation = useCallback(async (): Promise<ArtifactDTO | null> => {
    if (!jobId) return null;
    const cacheKey = `artifact:${jobId}:explanation`;
    
    const cached = generationCache.get<ArtifactDTO>(cacheKey);
    if (cached) return cached;

    setLoading(true);
    try {
      const artifact = await generationClient.getExplanation(jobId);
      generationCache.set(cacheKey, artifact, 60000 * 5); // 5 min TTL
      return artifact;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const fetchAllArtifacts = useCallback(async (): Promise<ArtifactDTO[] | null> => {
    if (!jobId) return null;
    const cacheKey = `artifacts:${jobId}:all`;

    const cached = generationCache.get<ArtifactDTO[]>(cacheKey);
    if (cached) return cached;

    setLoading(true);
    try {
      const artifacts = await generationClient.getArtifacts(jobId);
      generationCache.set(cacheKey, artifacts, 60000 * 5);
      return artifacts;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  return { 
    result, 
    loading, 
    error, 
    refresh: fetchResult,
    fetchExplanation,
    fetchAllArtifacts
  };
}

