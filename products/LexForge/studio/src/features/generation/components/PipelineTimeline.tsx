"use client";
import React from "react";
import { useGenerationStore, useGenerationProgress } from "../../../lib/client";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const STAGES = [
  { id: "initialize", label: "Initialize" },
  { id: "construction", label: "Construction" },
  { id: "evaluation", label: "Evaluation" },
  { id: "filtering", label: "Filtering" },
  { id: "ranking", label: "Ranking" },
  { id: "diversification", label: "Diversification" },
  { id: "selection", label: "Selection" },
  { id: "explanation", label: "Explanation" }
];

export function PipelineTimeline() {
  const selectedJobId = useGenerationStore((state) => state.selectedJobId);
  const { progress } = useGenerationProgress(selectedJobId);

  if (!selectedJobId) return null;

  const extractStage = (message?: string) => {
    if (!message) return "initialize";
    const lower = message.toLowerCase();
    for (const stage of STAGES) {
      if (lower.includes(stage.id)) return stage.id;
    }
    return "initialize";
  };

  const currentStage = extractStage(progress?.message);
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);
  const isCompleted = progress?.status === "Completed";

  return (
    <div className="p-6 border rounded-lg bg-card">
      <h3 className="text-sm font-medium mb-4">Pipeline Execution</h3>
      <div className="space-y-4">
        {STAGES.map((stage, index) => {
          const isPast = index < currentIndex || isCompleted;
          const isCurrent = index === currentIndex && !isCompleted;

          return (
            <div key={stage.id} className="flex items-center space-x-3">
              {isPast ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-muted" />
              )}
              <span className={`text-sm ${isCurrent ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

