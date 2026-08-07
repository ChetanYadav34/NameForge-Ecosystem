import React from 'react';

export const CommandBarShell = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 ${className}`}>
      <div className="flex h-16 w-full items-center rounded-full border border-glass-border bg-glass-background/80 backdrop-blur-glass px-4 shadow-glass transition-all hover:bg-glass-background/90">
        {children}
      </div>
    </div>
  );
};
