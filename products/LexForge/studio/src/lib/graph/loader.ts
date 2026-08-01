import { GraphData } from "./models";

export async function loadMockGraphData(): Promise<GraphData> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    nodes: [
      { id: "1", label: "computer", type: "word" },
      { id: "2", label: "compute", type: "lemma" },
      { id: "3", label: "machine", type: "synonym" }
    ],
    edges: [
      { id: "e1", source: "1", target: "2", type: "derives_from" },
      { id: "e2", source: "1", target: "3", type: "related_to" }
    ]
  };
}
