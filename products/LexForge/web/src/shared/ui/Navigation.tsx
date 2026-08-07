import React from 'react';
import { Button } from '@lexforge/ui';

export const Navigation = () => {
  return (
    <nav className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LexForge</h1>
        <div className="hidden md:flex gap-2">
          <Button variant="secondary" className="text-sm">Generation</Button>
          <Button variant="secondary" className="text-sm">History</Button>
          <Button variant="secondary" className="text-sm">Dictionary</Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="glass" className="text-sm">Account</Button>
      </div>
    </nav>
  );
};
