import { InspectorSectionProps, registerInspectorSection } from "../registry";

function PronunciationSection({ record }: InspectorSectionProps) {
  if (!record.ipa) return null;
  
  return (
    <div className="space-y-4">
      {record.ipa && (
        <div>
          <span className="text-muted-foreground text-xs block mb-1">IPA</span>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-foreground text-sm bg-background p-2 rounded border border-border">
              /{record.ipa}/
            </span>
          </div>
        </div>
      )}

      {(record.vowelCount !== undefined || record.stressPattern) && (
        <div className="grid grid-cols-2 gap-2 text-sm mt-4">
          <span className="text-muted-foreground">Syllables (Vowels)</span>
          <span className="font-mono text-foreground">{record.vowelCount !== undefined ? record.vowelCount : "Unknown"}</span>
          
          <span className="text-muted-foreground">Stress Pattern</span>
          <span className="font-mono text-foreground tracking-widest">{record.stressPattern || "Unknown"}</span>
        </div>
      )}
    </div>
  );
}

registerInspectorSection({
  id: "pronunciation",
  label: "Pronunciation",
  component: PronunciationSection,
  shouldRender: (record) => !!record.ipa && record.ipa.length > 0
});

export default PronunciationSection;
