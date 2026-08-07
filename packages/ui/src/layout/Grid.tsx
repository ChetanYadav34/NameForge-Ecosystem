import React from 'react';

export const Grid = ({ children, className = '', cols = 1, gap = 4 }: { children: React.ReactNode, className?: string, cols?: number, gap?: number }) => {
  return <div className={`grid grid-cols-${cols} gap-${gap} ${className}`}>{children}</div>;
};
