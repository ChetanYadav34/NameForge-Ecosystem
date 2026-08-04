"use client";
import React, { useState } from "react";
import { useGeneration } from "../../../lib/client";

export function GenerationForm() {
  const { generate, loading, error } = useGeneration();
  const [seed, setSeed] = useState("");
  const [objective, setObjective] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seed.trim() || !objective.trim()) return;

    await generate({
      seed,
      objective,
      settings: {
        source: "ui-initiated"
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg bg-card text-card-foreground">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none" htmlFor="seed">Brand Core / Seed Idea</label>
        <input
          id="seed"
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="e.g. quantum computing"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none" htmlFor="objective">Objective</label>
        <textarea
          id="objective"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="What kind of brand name do you need?"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="text-sm font-medium text-destructive">{error.message}</div>
      )}

      <button
        type="submit"
        disabled={loading || !seed.trim() || !objective.trim()}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 w-full"
      >
        {loading ? "Initializing..." : "Generate Names"}
      </button>
    </form>
  );
}

