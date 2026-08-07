import React from 'react';

export const Stack = ({ children, className = '', direction = 'col', gap = 4 }: { children: React.ReactNode, className?: string, direction?: 'row' | 'col', gap?: number }) => {
  return <div className={`flex flex-${direction} gap-${gap} ${className}`}>{children}</div>;
};
