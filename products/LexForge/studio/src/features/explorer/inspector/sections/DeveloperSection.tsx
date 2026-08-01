import { InspectorSectionProps, registerInspectorSection } from "../registry";

function DeveloperSection({ record }: InspectorSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-muted-foreground">Record ID</span>
        <span className="font-mono text-foreground text-xs">{record.id}</span>
      </div>
      
      <div>
        <span className="text-muted-foreground text-xs block mb-1">Raw JSON</span>
        <pre className="bg-background border border-border rounded p-3 text-[10px] text-muted-foreground overflow-x-auto max-h-[300px] overflow-y-auto font-mono">
          {JSON.stringify(record, null, 2)}
        </pre>
      </div>
    </div>
  );
}

registerInspectorSection({
  id: "developer",
  label: "Developer",
  component: DeveloperSection,
  shouldRender: () => true
});

export default DeveloperSection;
