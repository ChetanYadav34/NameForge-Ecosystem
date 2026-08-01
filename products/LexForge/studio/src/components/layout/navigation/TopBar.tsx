"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useLayoutStore } from "@/core/layout/manager";
import { Icons } from "@/core/design/icons";

export function TopBar() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const { toggleSidebar, toggleIntelligence, isSidebarOpen, isIntelligenceOpen } = useLayoutStore();

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-background px-4 shrink-0 relative z-10 select-none">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md hover:bg-surface-elevated"
        >
          {isSidebarOpen ? <Icons.SidebarClose size={18} /> : <Icons.SidebarOpen size={18} />}
        </button>
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="h-6 w-6 rounded bg-accent/10 border border-accent/30 text-accent flex items-center justify-center font-bold text-xs shadow-sm">
            NF
          </div>
          <Link href="/" className="font-heading font-semibold text-sm tracking-wide text-text-primary">
            NameForge OS
          </Link>
        </div>
      </div>

      {/* Global Search (Centered Cursor-style) */}
      <div className="flex-1 max-w-2xl px-8 mx-auto flex justify-center">
        <div className="relative group w-full max-w-md">
          <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-text-muted group-focus-within:text-accent transition-colors duration-200" />
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="h-9 w-full rounded-lg border border-border bg-surface-elevated/40 pl-10 pr-3 flex items-center text-[13px] text-text-muted hover:bg-surface-elevated hover:border-border-hover focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent transition-all duration-200 ease-out shadow-sm"
          >
            <span>Search workspace...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-surface px-1.5 font-mono text-[10px] font-medium text-text-muted opacity-100 border border-border shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
              <span>⌘</span>K
            </kbd>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleIntelligence}
          className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md hover:bg-surface-elevated"
        >
          {isIntelligenceOpen ? <Icons.IntelligenceClose size={18} /> : <Icons.IntelligenceOpen size={18} />}
        </button>
      </div>
    </header>
  );
}
