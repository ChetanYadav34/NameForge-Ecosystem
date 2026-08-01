"use client";

import { useAppStore } from "@/store/useAppStore";

export function StatusBar() {
  const { activeWorkspaceId } = useAppStore();

  return (
    <footer className="flex h-6 items-center justify-between border-t border-border bg-surface px-4 text-[11px] text-text-muted shrink-0 z-10 relative select-none">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent text-accent shadow-[0_0_8px_currentColor]" />
          <span className="uppercase tracking-wider font-semibold">OS Ready</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-widest text-[9px] font-semibold text-text-muted/70">Workspace</span>
          <span className="font-mono text-text-primary">{activeWorkspaceId || 'None'}</span>
        </div>
      </div>
      <div className="flex items-center gap-6 font-mono text-text-primary">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-widest text-[9px] font-semibold text-text-muted/70 font-sans">Core</span>
          <span>v2.0.0</span>
        </div>
      </div>
    </footer>
  );
}
