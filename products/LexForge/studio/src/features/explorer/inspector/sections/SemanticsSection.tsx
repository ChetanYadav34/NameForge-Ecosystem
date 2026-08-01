import { InspectorSectionProps, registerInspectorSection } from "../registry";

function SemanticsSection({ record }: InspectorSectionProps) {
  if (!record.definitions || record.definitions.length === 0) return null;

  return (
    <div className="space-y-4">
      <span className="text-muted-foreground text-xs block mb-1">Definitions</span>
      <div className="space-y-2">
        {record.definitions.map((def, idx) => (
          <div key={idx} className="bg-background p-3 rounded border border-border text-sm text-foreground">
            {def}
          </div>
        ))}
      </div>
      
      {record.synonyms && record.synonyms.length > 0 && (
        <div className="mt-4">
          <span className="text-muted-foreground text-xs block mb-1">Synonyms</span>
          <div className="flex flex-wrap gap-1">
            {record.synonyms.map(syn => (
              <span key={syn} className="px-2 py-1 rounded bg-background border border-border text-xs text-foreground">
                {syn}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {record.antonyms && record.antonyms.length > 0 && (
        <div className="mt-4">
          <span className="text-muted-foreground text-xs block mb-1">Antonyms</span>
          <div className="flex flex-wrap gap-1">
            {record.antonyms.map(ant => (
              <span key={ant} className="px-2 py-1 rounded bg-background border border-border text-xs text-foreground">
                {ant}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

registerInspectorSection({
  id: "semantics",
  label: "Semantics",
  component: SemanticsSection,
  shouldRender: (record) => !!record.definitions && record.definitions.length > 0
});

export default SemanticsSection;
