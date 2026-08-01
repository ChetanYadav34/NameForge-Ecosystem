"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useLayoutStore } from "@/core/layout/manager";
import { corePlugins } from "@/core/plugin/manager";
import { Icons, IconType } from "@/core/design/icons";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, sidebarWidth } = useLayoutStore();
  const navigation = corePlugins.getNavigation();

  if (!isSidebarOpen) return null;

  return (
    <aside 
      className="border-r border-border bg-surface shrink-0 flex flex-col transition-all duration-200"
      style={{ width: sidebarWidth }}
    >
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.route;
          const Icon = Icons[item.icon as IconType] || Icons.Plugin;
          return (
            <Link
              key={item.id}
              href={item.route}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150 ease-out relative",
                isActive 
                  ? "bg-surface-hover text-text-primary" 
                  : "text-text-muted hover:bg-surface-elevated hover:text-text-primary"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-accent rounded-r-full" />
              )}
              <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-accent" : "group-hover:text-text-secondary")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
