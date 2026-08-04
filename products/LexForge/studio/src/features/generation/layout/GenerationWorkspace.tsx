"use client";
import React from "react";
import { GenerationForm } from "../components/GenerationForm";
import { JobHistory } from "../components/JobHistory";
import { GenerationDashboard } from "../components/GenerationDashboard";

export function GenerationWorkspace() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Left Sidebar */}
      <div className="w-80 flex flex-col border-r bg-muted/10 shrink-0">
        <div className="p-6 border-b shrink-0">
          <h2 className="text-lg font-bold mb-4">New Generation</h2>
          <GenerationForm />
        </div>
        <div className="flex-1 overflow-hidden">
          <JobHistory />
        </div>
      </div>

      {/* Main Content */}
      <GenerationDashboard />
    </div>
  );
}

