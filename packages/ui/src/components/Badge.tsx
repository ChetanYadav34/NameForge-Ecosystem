import React from 'react';

export const Badge = ({ children, className = '', variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'success' | 'warning' | 'error' }) => {
  const variants = {
    default: 'bg-glass-background text-foreground border-glass-border',
    success: 'bg-green-500/10 text-green-700 border-green-200',
    warning: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
    error: 'bg-red-500/10 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
