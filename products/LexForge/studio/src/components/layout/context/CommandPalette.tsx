"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Database, Home, Network, Settings, CheckCircle, BookOpen } from "lucide-react";
import { useStudioStore } from "@/store/useStudioStore";

export function CommandPalette() {
  const open = useStudioStore((state) => state.commandPaletteOpen);
  const setOpen = useStudioStore((state) => state.setCommandPaletteOpen);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/explorer"))}>
            <Database className="mr-2 h-4 w-4" />
            Explorer
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/graph"))}>
            <Network className="mr-2 h-4 w-4" />
            Graph
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/validation"))}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Validation
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/resources"))}>
            <BookOpen className="mr-2 h-4 w-4" />
            Resources
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
