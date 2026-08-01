import {
  Search,
  Network,
  Database,
  FileBox,
  Settings,
  CheckCircle,
  LayoutDashboard,
  Box,
  Terminal,
  Activity,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  X,
  Maximize,
  Minimize,
  Moon,
  Sun
} from "lucide-react";

export const Icons = {
  Search,
  Graph: Network,
  Dataset: Database,
  Resource: FileBox,
  Settings,
  Validation: CheckCircle,
  Dashboard: LayoutDashboard,
  Plugin: Box,
  Terminal,
  Activity,
  Workspace: Layers,
  
  // Layout Controls
  SidebarClose: PanelLeftClose,
  SidebarOpen: PanelLeftOpen,
  IntelligenceClose: PanelRightClose,
  IntelligenceOpen: PanelRightOpen,
  
  // Window Controls
  Close: X,
  Maximize,
  Minimize,
  
  // Theme
  Dark: Moon,
  Light: Sun
};

export type IconType = keyof typeof Icons;
