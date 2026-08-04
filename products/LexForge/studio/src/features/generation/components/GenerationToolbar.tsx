"use client";
import React from "react";
import { useGenerationStore } from "../../../lib/client";
import { useGenerationJob } from "../../../lib/client";
import { Play, Square, Pause, RotateCcw } from "lucide-react";

export function GenerationToolbar() {
  const selectedJobId = useGenerationStore((state) => state.selectedJobId);
  const { job, cancel, pause, resume, restart } = useGenerationJob(selectedJobId);

  if (!job) return null;

  return (
    <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/30">
      <div className="text-sm font-medium px-2 truncate flex-1">
        Job: {job.id.substring(0, 8)}...
        <span className="ml-2 text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded text-xs uppercase">
          {job.status}
        </span>
      </div>

      <div className="flex items-center space-x-1">
        {job.status === "PAUSED" && (
          <button onClick={resume} className="p-2 hover:bg-muted rounded text-primary" aria-label="Resume">
            <Play className="w-4 h-4" />
          </button>
        )}
        
        {job.status === "RUNNING" && (
          <button onClick={pause} className="p-2 hover:bg-muted rounded text-amber-500" aria-label="Pause">
            <Pause className="w-4 h-4" />
          </button>
        )}

        {["RUNNING", "PAUSED", "PENDING"].includes(job.status) && (
          <button onClick={cancel} className="p-2 hover:bg-muted rounded text-destructive" aria-label="Cancel">
            <Square className="w-4 h-4" />
          </button>
        )}

        {["Completed", "Failed", "Cancelled"].includes(job.status) && (
          <button onClick={restart} className="p-2 hover:bg-muted rounded text-primary" aria-label="Restart">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

