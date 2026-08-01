"use client";

import { useExplorerStore } from "@/store/useExplorerStore";
import { FilterDefinition } from "@/lib/explorer/types";

const EXPLORER_FILTERS: FilterDefinition[] = [
  { id: "hasIpa", label: "Has IPA", type: "boolean" },
  { id: "hasMorphology", label: "Has Morphology", type: "boolean" },
  { id: "hasFrequency", label: "Has Frequency Data", type: "boolean" },
  { id: "hasDefinitions", label: "Has Definitions", type: "boolean" },
  { id: "hasFamily", label: "Has Word Family", type: "boolean" },
  {
    id: "frequencyBand",
    label: "Frequency Band",
    type: "multi-select",
    options: [
      { label: "Very Common (Zipf 5+)", value: "very-common" },
      { label: "Common (Zipf 4-5)", value: "common" },
      { label: "Uncommon (Zipf 3-4)", value: "uncommon" },
      { label: "Rare (Zipf 2-3)", value: "rare" },
      { label: "Very Rare (Zipf <2)", value: "very-rare" },
    ]
  },
  {
    id: "pos",
    label: "Part of Speech",
    type: "multi-select",
    options: [
      { label: "Noun", value: "noun" },
      { label: "Verb", value: "verb" },
      { label: "Adjective", value: "adjective" },
      { label: "Adjective Satellite", value: "adjective satellite" },
      { label: "Adverb", value: "adverb" },
    ]
  }
];

export function FiltersPanel() {
  const { filters, setFilter } = useExplorerStore();

  const renderFilter = (def: FilterDefinition) => {
    const value = filters[def.id];

    if (def.type === "boolean") {
      return (
        <label key={def.id} className="flex items-center space-x-2 cursor-pointer mb-2">
          <input 
            type="checkbox"
            checked={!!value}
            onChange={(e) => setFilter(def.id, e.target.checked)}
            className="rounded border-border bg-background text-primary focus:ring-primary h-4 w-4"
          />
          <span className="text-sm font-medium text-foreground">{def.label}</span>
        </label>
      );
    }

    if (def.type === "multi-select" && def.options) {
      return (
        <div key={def.id} className="mb-4">
          <h4 className="text-sm font-bold text-foreground mb-2">{def.label}</h4>
          <div className="space-y-1 pl-1">
            {def.options.map(opt => {
              const arr = (value as string[]) || [];
              const isChecked = arr.includes(opt.value);
              return (
                <label key={opt.value} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      let nextArr = [...arr];
                      if (e.target.checked) nextArr.push(opt.value);
                      else nextArr = nextArr.filter(v => v !== opt.value);
                      setFilter(def.id, nextArr);
                    }}
                    className="rounded border-border bg-background text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span className="text-xs text-muted-foreground hover:text-foreground transition-colors">{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h3 className="text-sm font-heading font-bold text-muted-foreground uppercase tracking-wider mb-6">
        Filters
      </h3>
      <div className="space-y-4">
        {EXPLORER_FILTERS.filter(f => f.type === "boolean").map(renderFilter)}
        <div className="h-px bg-border/50 my-4" />
        {EXPLORER_FILTERS.filter(f => f.type === "multi-select").map(renderFilter)}
      </div>
    </div>
  );
}
