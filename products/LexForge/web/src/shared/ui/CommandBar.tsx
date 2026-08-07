import React from 'react';
import { CommandBarShell, Input } from '@lexforge/ui';
import { useUIStore } from '../../store/useUIStore';

export const CommandBar = () => {
  const { activeModal, closeModal } = useUIStore();
  const isOpen = activeModal === 'command-bar';

  if (!isOpen) return null;

  return (
    <CommandBarShell>
      <Input placeholder="Type a command or search..." className="w-full bg-transparent border-none text-lg p-4 focus:ring-0" autoFocus />
      <div className="p-4 border-t border-white/10 text-sm text-white/50 flex flex-col gap-2">
        <div className="flex justify-between hover:bg-white/5 p-2 rounded cursor-pointer">
          <span>Generate Name</span>
          <span className="text-xs bg-white/10 px-2 py-1 rounded">⌘ G</span>
        </div>
        <div className="flex justify-between hover:bg-white/5 p-2 rounded cursor-pointer">
          <span>Open History</span>
          <span className="text-xs bg-white/10 px-2 py-1 rounded">⌘ H</span>
        </div>
      </div>
    </CommandBarShell>
  );
};
