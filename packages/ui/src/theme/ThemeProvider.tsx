import React from 'react';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="light bg-transparent text-foreground min-h-screen">{children}</div>;
};
