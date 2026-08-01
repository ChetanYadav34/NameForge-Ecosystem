import { VisualizationMode } from "../registry/types";

export class GraphMode implements VisualizationMode {
  id = "mode.graph";
  name = "Knowledge Graph";
  component = () => null; // React rendering logic
}

export class TreeMode implements VisualizationMode {
  id = "mode.tree";
  name = "Hierarchical Tree";
  component = () => null;
}

export class RadialMode implements VisualizationMode {
  id = "mode.radial";
  name = "Radial View";
  component = () => null;
}

export class MatrixMode implements VisualizationMode {
  id = "mode.matrix";
  name = "Adjacency Matrix";
  component = () => null;
}
