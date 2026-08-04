"use client";
import React, { useEffect, useState } from "react";
import { useGenerationStore, useGenerationResult } from "../../../lib/client";
import { LoadingState } from "./LoadingState";
import { Download, FileJson } from "lucide-react";

export function ArtifactPanel() {
  const selectedJobId = useGenerationStore((state) => state.selectedJobId);
  const { fetchAllArtifacts } = useGenerationResult(selectedJobId);
  
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedJobId) {
      setArtifacts([]);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetchAllArtifacts().then(data => {
      if (isMounted) {
        setArtifacts(data || []);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedJobId, fetchAllArtifacts]);

  if (!selectedJobId) return null;
  if (loading) return <div className="p-4"><LoadingState message="Loading artifacts..." /></div>;
  if (!artifacts.length) return null;

  return (
    <div className="p-6 border rounded-lg bg-card mt-6">
      <h3 className="text-lg font-bold mb-4">Research Artifacts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {artifacts.map((artifact, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <FileJson className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{artifact.type || `Artifact ${i+1}`}</p>
                <p className="text-xs text-muted-foreground">JSON</p>
              </div>
            </div>
            <a 
              href={`/api/generation/jobs/${selectedJobId}/artifacts/${artifact.type}/download`}
              download
              className="p-2 text-muted-foreground hover:text-primary rounded-md hover:bg-background cursor-pointer inline-flex"
              title="Download Artifact"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

