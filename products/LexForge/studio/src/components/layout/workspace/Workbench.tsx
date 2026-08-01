"use client";

import { ReactNode } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Icons } from "@/core/design/icons";
import { cn } from "../navigation/Sidebar";

interface WorkbenchProps {
  children: ReactNode;
}

export function Workbench({ children }: WorkbenchProps) {
  const { workspaceTabs, activeTabId, closeTab, setActiveTab } = useAppStore();

  return (
    <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-background relative">
      {/* Workspace Tabs */}
      <div className="flex items-center h-10 bg-surface border-b border-border overflow-x-auto no-scrollbar shrink-0 pl-1">
        {workspaceTabs.length > 0 && workspaceTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "group flex items-center h-full px-4 gap-2 border-r border-border min-w-[140px] max-w-[240px] cursor-pointer transition-colors text-[13px] select-none relative",
              activeTabId === tab.id 
                ? "bg-background text-text-primary" 
                : "bg-surface-elevated text-text-muted hover:bg-surface-hover hover:text-text-primary"
            )}
          >
            {activeTabId === tab.id && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-accent" />
            )}
            <span className="truncate flex-1">{tab.title}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
              className={cn(
                "p-1 rounded-md transition-all duration-150",
                activeTabId === tab.id 
                  ? "opacity-100 text-text-muted hover:bg-surface hover:text-text-primary" 
                  : "opacity-0 group-hover:opacity-100 text-text-muted hover:bg-surface-elevated hover:text-text-primary"
              )}
            >
              <Icons.Close size={14} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Active Workspace / Page Content */}
      <div className="flex-1 overflow-auto bg-background">
        {children}
      </div>
    </main>
  );
}
