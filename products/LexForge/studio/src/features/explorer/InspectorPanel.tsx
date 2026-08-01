"use client";

import { useExplorerStore } from "@/store/useExplorerStore";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { getInspectorSections } from "./inspector/registry";
import { useState } from "react";

// Import all sections to ensure they are registered
import "./inspector/sections/GeneralSection";
import "./inspector/sections/PronunciationSection";
import "./inspector/sections/MorphologySection";
import "./inspector/sections/FrequencySection";
import "./inspector/sections/SemanticsSection";
import "./inspector/sections/WordFamilySection";
import "./inspector/sections/DeveloperSection";

function Accordion({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden bg-card/20 mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-surface-elevated hover:bg-surface-elevated/80 transition-colors text-sm font-bold tracking-wide"
      >
        <span className="uppercase text-muted-foreground">{title}</span>
        {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-border/50">
          {children}
        </div>
      )}
    </div>
  );
}

export function InspectorPanel() {
  const { inspectingRecord, inspectingLoading, selectedWordId } = useExplorerStore();

  if (inspectingLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p>Loading record...</p>
      </div>
    );
  }

  if (!inspectingRecord || !selectedWordId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
        <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
          <span className="font-heading text-2xl font-bold opacity-20">L</span>
        </div>
        <p>Select a word to inspect</p>
      </div>
    );
  }

  const sections = getInspectorSections().filter(section => section.shouldRender(inspectingRecord));

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none pb-4 border-b border-border/50 mb-4">
        <h2 className="text-3xl font-heading font-bold text-primary mb-1">
          {inspectingRecord.word}
        </h2>
        <div className="flex gap-2">
          {inspectingRecord.partOfSpeech.map(pos => (
            <span key={pos} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/10 text-accent uppercase tracking-wider border border-accent/20">
              {pos}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-20">
        {sections.map(section => (
          <Accordion key={section.id} title={section.label} defaultOpen={section.id === "general" || section.id === "frequency"}>
            <section.component record={inspectingRecord} />
          </Accordion>
        ))}
      </div>
    </div>
  );
}
