import React from 'react';
import { GlassPanel } from '../../shared/ui/GlassPanel';
import { Stack, Button } from '@lexforge/ui';

export const HistoryDock = () => {
  return (
    <GlassPanel className="w-80 h-full p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">History</h3>
        <Button variant="secondary" className="text-xs px-2 py-1">Clear</Button>
      </div>
      <Stack gap={2} className="flex-1 overflow-auto">
        <div className="text-center text-white/40 text-sm mt-8">No generation history yet.</div>
      </Stack>
    </GlassPanel>
  );
};
