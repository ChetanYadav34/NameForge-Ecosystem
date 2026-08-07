import React from 'react';

export const Divider = ({ className = '' }: { className?: string }) => {
  return <hr className={`border-t border-glass-border my-4 ${className}`} />;
};
