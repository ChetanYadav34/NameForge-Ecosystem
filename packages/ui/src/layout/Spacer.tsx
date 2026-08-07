import React from 'react';

export const Spacer = ({ size = 4 }: { size?: number }) => {
  return <div className={`h-${size} w-${size}`} aria-hidden="true" />;
};
