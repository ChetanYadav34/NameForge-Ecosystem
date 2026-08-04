"use client";
import React from "react";
import { useGenerationStore } from "../../../lib/client";
import { useGenerationProgress } from "../../../lib/client";

export function GenerationProgress() {
  const selectedJobId = useGenerationStore((state) => state.selectedJobId);
  const { progress } = useGenerationProgress(selectedJobId);

  if (!selectedJobId) return null;
  
  // If we don't have active progress yet, we just show empty or starting
  // Simulate progress or use indeterminate since we don't have progressPercentage
  const message = progress?.status === "Completed" ? "Generation Complete" : (progress?.message || "Initializing pipeline...");
  const p = progress?.status === "Completed" ? 100 : (progress?.progressPercentage ?? 0);

  return (
    <div className="space-y-2 p-4 border rounded-lg bg-card">
      <div className="flex justify-between text-sm font-medium">
        <span>{message}</span>
        {p > 0 && <span>{Math.round(p)}%</span>}
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full bg-primary transition-all duration-300 ease-out ${progress && progress.status !== "Completed" ? "animate-pulse w-full" : ""}`}
          style={{ width: `${p}%` }}
        />
      </div>
    </div>
  );
}

