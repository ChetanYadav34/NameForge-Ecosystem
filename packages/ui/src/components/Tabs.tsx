import React from 'react';

export const Tabs = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return <div className={`flex space-x-1 rounded-xl bg-glass-background/50 p-1 backdrop-blur-glass ${className}`}>{children}</div>;
};

export const Tab = ({ children, active, onClick }: { children: React.ReactNode, active?: boolean, onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
        active 
          ? 'bg-glass-background text-foreground shadow' 
          : 'text-muted hover:bg-glass-background/50 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
};
