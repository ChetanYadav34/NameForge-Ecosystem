import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`rounded-xl border border-glass-border bg-glass-background backdrop-blur-glass shadow-glass overflow-hidden ${className}`}>
      {children}
    </div>
  );
};
