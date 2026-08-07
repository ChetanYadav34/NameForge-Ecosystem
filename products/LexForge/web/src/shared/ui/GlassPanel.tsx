import React from 'react';
import { Card } from '@lexforge/ui';

export const GlassPanel = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <Card className={`bg-glass-background/80 backdrop-blur-md border-glass-border shadow-lg ${className}`}>
      {children}
    </Card>
  );
};
