import React from 'react';

export const Toggle = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean; onPressedChange?: (pressed: boolean) => void }>(({ className = '', pressed, onPressedChange, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={pressed}
      onClick={() => onPressedChange?.(!pressed)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${pressed ? 'bg-primary' : 'bg-glass-border'} ${className}`}
      {...props}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${pressed ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
});
Toggle.displayName = "Toggle";
