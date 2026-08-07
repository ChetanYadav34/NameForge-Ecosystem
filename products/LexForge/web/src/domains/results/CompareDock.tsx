import React from 'react';
import { GlassPanel } from '../../shared/ui/GlassPanel';
import { Stack, Button } from '@lexforge/ui';

export const CompareDock = () => {
  return (
    <GlassPanel className="w-full h-48 fixed bottom-0 left-0 right-0 z-40 p-4 border-t border-glass-border translate-y-full">
      <div className="max-w-6xl mx-auto flex gap-4 h-full">
        <div className="w-48 flex flex-col justify-center">
          <h3 className="font-semibold mb-2">Compare</h3>
          <Button variant="primary" className="w-full mb-2">Analyze</Button>
          <Button variant="secondary" className="w-full text-xs">Clear All</Button>
        </div>
        <div className="flex-1 flex gap-4 overflow-x-auto">
          {/* Compare items will go here */}
          <div className="w-64 h-full rounded border border-dashed border-white/20 flex items-center justify-center text-white/30 text-sm">
            Add result to compare
          </div>
        </div>
      </div>
    </GlassPanel>
  );
};
