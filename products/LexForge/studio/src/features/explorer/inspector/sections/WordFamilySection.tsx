import { InspectorSectionProps, registerInspectorSection } from "../registry";

function WordFamilySection({ record }: InspectorSectionProps) {
  if (!record.familyId) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-muted-foreground">Family ID</span>
        <span className="font-mono text-foreground text-xs bg-background px-2 py-1 rounded border border-border">
          {record.familyId}
        </span>
      </div>
      
      {/* 
        In the future, we can load the full family members list here. 
        For now, we just display the ID as it requires a separate repository fetch to get members.
      */}
      <p className="text-xs text-muted-foreground italic">
        (Word family member list will be implemented in future iterations)
      </p>
    </div>
  );
}

registerInspectorSection({
  id: "wordFamily",
  label: "Word Family",
  component: WordFamilySection,
  shouldRender: (record) => !!record.familyId
});

export default WordFamilySection;
