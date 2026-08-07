import React from 'react';

export const Chip = ({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center rounded-full border border-glass-border bg-glass-background px-3 py-1 text-sm font-medium hover:bg-glass-background/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    >
      {children}
    </button>
  );
};
