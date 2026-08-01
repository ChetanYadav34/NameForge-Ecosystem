import { InspectorSectionProps, registerInspectorSection } from "../registry";

function MorphologySection({ record }: InspectorSectionProps) {
  const hasMorphology = (record.inflections && record.inflections.length > 0) || (record.derivations && record.derivations.length > 0);
  if (!hasMorphology) return null;

  return (
    <div className="space-y-4">
      {record.inflections && record.inflections.length > 0 && (
        <div>
          <span className="text-muted-foreground text-xs block mb-1">Inflections</span>
          <div className="flex flex-wrap gap-1">
            {record.inflections.map(inf => (
              <span key={inf} className="px-2 py-1 rounded bg-background border border-border text-xs text-foreground">
                {inf}
              </span>
            ))}
          </div>
        </div>
      )}

      {record.derivations && record.derivations.length > 0 && (
        <div>
          <span className="text-muted-foreground text-xs block mb-1">Derivations</span>
          <div className="flex flex-wrap gap-1">
            {record.derivations.map(der => (
              <span key={der} className="px-2 py-1 rounded bg-background border border-border text-xs text-foreground">
                {der}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

registerInspectorSection({
  id: "morphology",
  label: "Morphology",
  component: MorphologySection,
  shouldRender: (record) => ((record.inflections && record.inflections.length > 0) || (record.derivations && record.derivations.length > 0)) as boolean
});

export default MorphologySection;
