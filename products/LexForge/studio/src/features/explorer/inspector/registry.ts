import { LexEntry } from "@/lib/dataset/types";

export interface InspectorSectionProps {
  record: LexEntry;
}

export interface InspectorSectionDefinition {
  id: string;
  label: string;
  component: React.ComponentType<InspectorSectionProps>;
  shouldRender: (record: LexEntry) => boolean;
}

const registry: InspectorSectionDefinition[] = [];

export function registerInspectorSection(def: InspectorSectionDefinition) {
  registry.push(def);
}

export function getInspectorSections(): InspectorSectionDefinition[] {
  return registry;
}
