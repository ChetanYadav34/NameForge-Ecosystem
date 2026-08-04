"use client";
import React, { useState } from "react";
import { useGenerationStore, useGenerationResult } from "../../../lib/client";
import { GenerationToolbar } from "./GenerationToolbar";
import { GenerationProgress } from "./GenerationProgress";
import { PipelineTimeline } from "./PipelineTimeline";
import { CandidateGrid } from "./CandidateGrid";
import { CandidateDetails } from "./CandidateDetails";
import { ExplanationPanel } from "./ExplanationPanel";
import { ArtifactPanel } from "./ArtifactPanel";
import { EmptyState } from "./EmptyState";
import { Sparkles, BarChart2, Hash, Award, Clock } from "lucide-react";
import { CandidateDTO } from "../../../lib/services/generation/dto";

export function GenerationDashboard() {
  const selectedJobId = useGenerationStore((state) => state.selectedJobId);
  const job = useGenerationStore((state) => selectedJobId ? state.jobs[selectedJobId] : null);
  
  const { result, fetchAllArtifacts } = useGenerationResult(selectedJobId);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<CandidateDTO[]>([]);

  React.useEffect(() => {
    if (selectedJobId && job?.status === "Completed") {
      if (result?.candidates && Array.isArray(result.candidates)) {
        setCandidates(result.candidates);
      } else {
        setCandidates([]);
      }
    }
  }, [selectedJobId, job?.status, result?.candidates]);

  if (!selectedJobId || !job) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <EmptyState 
          icon={<Sparkles className="w-12 h-12" />}
          title="NameForge Workspace"
          description="Select a job from the history panel or initiate a new generation to see real-time progress and results."
        />
      </div>
    );
  }

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);
  const isCompleted = job.status === "Completed";

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <div className="p-6 border-b shrink-0 space-y-6">
        <GenerationToolbar />
        
        {!isCompleted && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GenerationProgress />
            </div>
            <div>
              <PipelineTimeline />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isCompleted && (
          <div className="space-y-8 max-w-7xl mx-auto">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Generation Results</h2>
                <p className="text-muted-foreground mt-1">
                  Job ID: {job.id}
                </p>
              </div>

              {/* Generation Summary Card */}
              {candidates.length > 0 && (
                <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/20 border rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground flex items-center gap-1"><Hash className="w-4 h-4"/> Total Candidates</span>
                    <span className="text-2xl font-bold">{candidates.length}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground flex items-center gap-1"><Award className="w-4 h-4"/> Highest Score</span>
                    <span className="text-2xl font-bold text-primary">
                      {Math.round(Math.max(...candidates.map(c => isNaN(c.score) ? 0 : c.score)) * 100)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground flex items-center gap-1"><BarChart2 className="w-4 h-4"/> Average Score</span>
                    <span className="text-2xl font-bold">
                      {Math.round((candidates.reduce((acc, c) => acc + (isNaN(c.score) ? 0 : c.score), 0) / candidates.length) * 100)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="w-4 h-4"/> Artifacts Generated</span>
                    <span className="text-2xl font-bold">{result?.artifactsAvailable?.length || 0}</span>
                  </div>
                </div>
              )}

              <CandidateGrid 
                candidates={candidates} 
                onSelect={setSelectedCandidateId} 
                emptyStateReason={
                  job.status === "Failed" ? "Generation failed." :
                  (candidates.length === 0 ? "No candidates survived filtering." : undefined)
                }
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExplanationPanel />
              <ArtifactPanel />
            </div>
          </div>
        )}
      </div>

      {selectedCandidate && (
        <CandidateDetails 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidateId(null)} 
        />
      )}
    </div>
  );
}

