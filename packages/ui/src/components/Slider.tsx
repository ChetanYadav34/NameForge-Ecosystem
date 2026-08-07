import React from 'react';

export const Slider = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className = '', ...props }, ref) => {
  return (
    <input
      type="range"
      ref={ref}
      className={`w-full h-2 bg-glass-border rounded-lg appearance-none cursor-pointer accent-primary ${className}`}
      {...props}
    />
  );
});
Slider.displayName = "Slider";
