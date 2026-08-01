import { InspectorSectionProps, registerInspectorSection } from "../registry";

function FrequencySection({ record }: InspectorSectionProps) {
  const freq = record.frequency;
  if (!freq) return null;

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">Zipf Score</span>
        <span className="font-mono text-foreground text-lg">{freq.zipf.toFixed(2)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">Frequency Band</span>
        <span className="font-semibold text-foreground uppercase tracking-wide">{freq.band}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">Dataset Rank</span>
        <span className="font-mono text-foreground">#{freq.lexforgeRank?.toLocaleString() || "N/A"}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">Percentile</span>
        <span className="font-mono text-foreground">{freq.lexforgePercentile?.toFixed(2) || "N/A"}%</span>
      </div>
    </div>
  );
}

registerInspectorSection({
  id: "frequency",
  label: "Frequency",
  component: FrequencySection,
  shouldRender: (record) => !!record.frequency
});

export default FrequencySection;
