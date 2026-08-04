"use client";
import React from "react";
import { CandidateCard } from "./CandidateCard";
import { CandidateDTO } from "../../../lib/services/generation/dto";

interface CandidateGridProps {
  candidates: CandidateDTO[];
  onSelect: (candidateId: string) => void;
  emptyStateReason?: string;
}

export function CandidateGrid({ candidates, onSelect, emptyStateReason = "No candidates generated yet." }: CandidateGridProps) {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10 border-dashed">
        <p className="text-muted-foreground">{emptyStateReason}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {candidates.map(candidate => (
        <CandidateCard 
          key={candidate.id} 
          candidate={candidate} 
          onClick={() => onSelect(candidate.id)} 
        />
      ))}
    </div>
  );
}

