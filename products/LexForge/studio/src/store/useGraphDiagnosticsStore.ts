
import { create } from "zustand";

interface DiagnosticsState {
  datasetNodes: number;
  datasetRelationships: number;
  providerExecutions: number;
  relationshipsReturned: number;
  graphNodes: number;
  graphEdges: number;
  sceneNodes: number;
  sceneEdges: number;
  renderedNodes: number;
  renderedEdges: number;
  missingLabels: number;
  duplicateNodes: number;
  duplicateEdges: number;
  relationshipFilterValues: string[];
  activeRelationshipDefinitions: string[];
  activeProviderIds: string[];
  setMetrics: (metrics: Partial<DiagnosticsState>) => void;
}

export const useGraphDiagnosticsStore = create<DiagnosticsState>((set) => ({
  datasetNodes: 0,
  datasetRelationships: 0,
  providerExecutions: 0,
  relationshipsReturned: 0,
  graphNodes: 0,
  graphEdges: 0,
  sceneNodes: 0,
  sceneEdges: 0,
  renderedNodes: 0,
  renderedEdges: 0,
  missingLabels: 0,
  duplicateNodes: 0,
  duplicateEdges: 0,
  relationshipFilterValues: [],
  activeRelationshipDefinitions: [],
  activeProviderIds: [],
  setMetrics: (metrics) => set((state) => ({ ...state, ...metrics }))
}));

