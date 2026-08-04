"use client";
import React, { useEffect, useState } from "react";
import { useGenerationStore, useGenerationResult } from "../../../lib/client";
import { LoadingState } from "./LoadingState";

export function ExplanationPanel() {
  const selectedJobId = useGenerationStore((state) => state.selectedJobId);
  const { fetchExplanation } = useGenerationResult(selectedJobId);
  
  const [explanation, setExplanation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    if (!selectedJobId) {
      setExplanation(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetchExplanation().then(data => {
      if (isMounted) {
        setExplanation(data?.data || null); // Unwrap ArtifactDTO
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedJobId, fetchExplanation]);

  if (!selectedJobId) return null;
  if (loading) return <div className="p-4"><LoadingState message="Loading explanation..." /></div>;
  if (!explanation) return null;

  const summary = explanation.summary || {};

  return (
    <div className="p-6 border rounded-lg bg-card mt-6">
      <h3 className="text-lg font-bold mb-4">Generation Explanation</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-muted/20 border rounded-md">
          <div className="text-xs text-muted-foreground uppercase">Avg Confidence</div>
          <div className="text-xl font-semibold text-primary">{Math.round((summary.averageConfidence || 0) * 100)}%</div>
        </div>
        <div className="p-4 bg-muted/20 border rounded-md">
          <div className="text-xs text-muted-foreground uppercase">Evidence Depth</div>
          <div className="text-xl font-semibold">{summary.averageEvidenceDepth || 0}</div>
        </div>
        <div className="p-4 bg-muted/20 border rounded-md">
          <div className="text-xs text-muted-foreground uppercase">Rules Supported</div>
          <div className="text-xl font-semibold">{summary.averageSupportingRules || 0}</div>
        </div>
        <div className="p-4 bg-muted/20 border rounded-md">
          <div className="text-xs text-muted-foreground uppercase">Patterns Supported</div>
          <div className="text-xl font-semibold">{summary.averageSupportingPatterns || 0}</div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden mt-4">
        <button 
          onClick={() => setShowJson(!showJson)}
          className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-semibold text-sm">Raw Pipeline Data</h4>
          <span className="text-xs text-muted-foreground">{showJson ? "Hide" : "Show"} JSON</span>
        </button>
        {showJson && (
          <div className="p-4 bg-black/90 max-h-96 overflow-y-auto">
            <pre className="text-xs text-green-400 whitespace-pre-wrap">
              {JSON.stringify(explanation, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

