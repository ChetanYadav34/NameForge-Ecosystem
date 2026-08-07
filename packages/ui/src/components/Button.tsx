import React from 'react';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'glass' }>(({ children, variant = 'primary', className = '', ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-button px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-foreground hover:bg-secondary/80",
    glass: "backdrop-blur-glass bg-glass-background border border-glass-border text-foreground hover:bg-glass-background/80 shadow-glass"
  };
  
  return (
    <button ref={ref} className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
});
Button.displayName = 'Button';
