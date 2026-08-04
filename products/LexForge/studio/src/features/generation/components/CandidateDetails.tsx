"use client";
import React from "react";
import { X, ExternalLink, Check, Copy } from "lucide-react";
import { useState } from "react";
import { CandidateDTO } from "../../../lib/services/generation/dto";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CandidateDetailsProps {
  candidate: CandidateDTO;
  onClose: () => void;
}

export function CandidateDetails({ candidate, onClose }: CandidateDetailsProps) {
  const [showJson, setShowJson] = useState(false);

  if (!candidate) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l shadow-2xl flex flex-col z-50 animate-in slide-in-from-right">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">{candidate.name}</h2>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Scorecard</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-card">
              <div className="text-3xl font-bold text-primary">{Math.round(candidate.score * 100)}</div>
              <div className="text-xs text-muted-foreground uppercase mt-1">Global Score</div>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <div className="text-3xl font-bold">{candidate.rank}</div>
              <div className="text-xs text-muted-foreground uppercase mt-1">Rank</div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Details</h3>
          <div className="space-y-4">
            
            {/* Evaluation Metrics */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Evaluation Metrics</h4>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(candidate.details?.metrics || {}, null, 2)}
              </pre>
            </div>

            {/* Construction Fragments */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Construction Fragments</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {(candidate.details?.fragments || []).length > 0 ? (
                  candidate.details!.fragments!.map((f, i) => (
                    <li key={i}>{f.type}: {f.value}</li>
                  ))
                ) : <li>No fragments</li>}
              </ul>
            </div>

            {/* Selection Reason */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Selection Reason</h4>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(candidate.details?.selectionReason || {}, null, 2)}
              </pre>
            </div>
            
            {/* Raw JSON */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                onClick={() => setShowJson(!showJson)}
                className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <h4 className="font-semibold">Raw JSON</h4>
                {showJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showJson && (
                <div className="p-4 bg-black/90">
                  <pre className="text-xs text-green-400 whitespace-pre-wrap overflow-x-auto">
                    {candidate.details?.rawJson || "{}"}
                  </pre>
                </div>
              )}
            </div>

          </div>
        </section>
      </div>

      <div className="p-4 border-t bg-muted/30">
        <button className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:bg-primary/90">
          <Check className="w-4 h-4" />
          <span>Select Name</span>
        </button>
      </div>
    </div>
  );
}

