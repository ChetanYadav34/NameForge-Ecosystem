import React from 'react';

export const Tooltip = ({ children, content }: { children: React.ReactNode, content: React.ReactNode }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
        {content}
      </div>
    </div>
  );
};
