import { InspectorSectionProps, registerInspectorSection } from "../registry";

function GeneralSection({ record }: InspectorSectionProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-muted-foreground">Length</span>
        <span className="font-mono text-foreground">{record.word.length} chars</span>
        
        <span className="text-muted-foreground">Part of Speech</span>
        <span className="text-foreground uppercase text-xs tracking-wider font-semibold">
          {record.partOfSpeech.join(", ") || "Unknown"}
        </span>
      </div>
      
      {record.sources.length > 0 && (
        <div className="mt-4">
          <span className="text-muted-foreground text-xs block mb-1">Sources</span>
          <div className="flex flex-wrap gap-1">
            {record.sources.map(src => (
              <span key={src} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary/10 text-secondary-foreground uppercase tracking-wider border border-border">
                {src}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

registerInspectorSection({
  id: "general",
  label: "General",
  component: GeneralSection,
  shouldRender: () => true
});

export default GeneralSection;
