import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { Stack, Button, Divider } from '@lexforge/ui';

export const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 h-full border-r border-white/10 bg-black/30 backdrop-blur-md p-4 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white/80">Menu</h2>
        <Button variant="secondary" onClick={toggleSidebar} className="text-xs py-1 px-2">Close</Button>
      </div>
      <Stack gap={2} className="flex-1">
        <Button variant="glass" className="justify-start">Workspaces</Button>
        <Button variant="glass" className="justify-start">Dictionary</Button>
        <Button variant="glass" className="justify-start">Settings</Button>
      </Stack>
      <Divider className="my-4" />
      <div className="text-xs text-white/40 text-center">LexForge v2.0</div>
    </aside>
  );
};
