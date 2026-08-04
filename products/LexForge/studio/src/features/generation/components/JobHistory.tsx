"use client";
import React, { useEffect, useState } from "react";
import { generationClient, useGenerationStore } from "../../../lib/client";
import { JobSummaryDTO } from "../../../lib/services/generation/dto";
import { Clock, RefreshCcw } from "lucide-react";

export function JobHistory() {
  const [history, setHistory] = useState<JobSummaryDTO[]>([]);
  const [loading, setLoading] = useState(false);
  
  const setSelectedJob = useGenerationStore((state) => state.setSelectedJob);
  const selectedJobId = useGenerationStore((state) => state.selectedJobId);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await generationClient.getJobs(1, 10);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col h-full border-r bg-muted/10">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recent Jobs</h2>
        <button onClick={fetchHistory} className="p-1 hover:bg-muted rounded">
          <RefreshCcw className={`w-4 h-4 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 && !loading && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No previous jobs found.
          </div>
        )}
        
        {history.map(job => (
          <button
            key={job.id}
            onClick={() => setSelectedJob(job.id)}
            className={`w-full text-left p-4 border-b transition-colors hover:bg-muted/50 ${
              selectedJobId === job.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm truncate pr-2">
                Job: {job.id.substring(0, 8)}...
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide
                ${job.status === "Completed" ? "bg-primary/10 text-primary" : 
                  job.status === "Failed" ? "bg-destructive/10 text-destructive" :
                  job.status === "Running" ? "bg-blue-500/10 text-blue-500" :
                  "bg-muted text-muted-foreground"}`}>
                {job.status}
              </span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

