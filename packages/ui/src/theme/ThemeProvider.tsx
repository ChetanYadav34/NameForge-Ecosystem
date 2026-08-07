import React from 'react';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="light bg-background text-foreground min-h-screen">{children}</div>;
};
