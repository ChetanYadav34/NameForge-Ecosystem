"use client";
import React from "react";
import { Sparkles } from "lucide-react";

import { CandidateDTO } from "../../../lib/services/generation/dto";

interface CandidateCardProps {
  candidate: CandidateDTO;
  onClick: () => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col p-6 border rounded-xl bg-card hover:border-primary cursor-pointer transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-bold tracking-tight">{candidate.name}</h3>
        {candidate.rank === 1 && (
          <Sparkles className="w-5 h-5 text-amber-500" />
        )}
      </div>
      
      <p className="text-sm text-muted-foreground flex-1 line-clamp-2">
        {candidate.shortExplanation || "A strong candidate matching the target persona."}
      </p>

      <div className="mt-4 flex items-center space-x-2">
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
          Score: {isNaN(candidate.score) ? "N/A" : Math.round(candidate.score * 100)}
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
          Rank: {candidate.rank !== undefined ? candidate.rank + 1 : "N/A"}
        </span>
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${candidate.status === 'accepted' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
          {candidate.status || "Unknown"}
        </span>
      </div>
    </div>
  );
}

