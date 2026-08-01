import { ReactNode } from "react";
import { TopBar } from "./navigation/TopBar";
import { Sidebar } from "./navigation/Sidebar";
import { StatusBar } from "./status/StatusBar";
import { ContextPanel } from "./context/ContextPanel";
import { Workbench } from "./workspace/Workbench";
import { CommandPalette } from "./context/CommandPalette";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background text-text-primary selection:bg-accent/20 relative">
      <TopBar />
      <div className="flex flex-1 overflow-hidden z-0">
        <Sidebar />
        <Workbench>{children}</Workbench>
        <ContextPanel />
      </div>
      <StatusBar />
      <CommandPalette />
    </div>
  );
}
