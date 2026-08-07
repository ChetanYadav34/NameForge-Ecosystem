import React from 'react';
import { GlassPanel } from '../../shared/ui/GlassPanel';
import { Input, Button, Stack } from '@lexforge/ui';

export const GenerationWorkspace = () => {
  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">Craft Your Vision</h1>
        <p className="text-xl text-white/60">Generate highly evocative linguistic identities.</p>
      </div>

      <GlassPanel className="w-full p-6">
        <Stack gap={4}>
          <Input 
            placeholder="Describe the product, theme, or feeling... (e.g. 'A fast, sleek cyberpunk motorcycle')" 
            className="text-lg py-6"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {/* Seed pills will go here */}
              <span className="text-sm text-white/40 italic">Add seeds to refine...</span>
            </div>
            <Button variant="primary" className="px-8">Generate</Button>
          </div>
        </Stack>
      </GlassPanel>
    </div>
  );
};
