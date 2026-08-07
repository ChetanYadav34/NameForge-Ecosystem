const fs = require('fs');
const path = require('path');

const uiDir = 'D:/Projects/NameForge-Ecosystem/packages/ui';
const srcDir = path.join(uiDir, 'src');

const files = {
  'tailwind.config.ts': import type { Config } from 'tailwindcss';
import tokens from '@lexforge/design-tokens/dist/tokens.json';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      boxShadow: tokens.shadows,
      fontFamily: tokens.typography.families,
      fontSize: tokens.typography.sizes,
    },
  },
  plugins: [],
};
export default config;,
  
  'tsconfig.json': {
  "compilerOptions": {
    "target": "es2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
},
  
  'src/index.ts': export * from './theme/ThemeProvider';
export * from './layout/Container';
export * from './layout/Stack';
export * from './layout/Grid';
export * from './layout/Spacer';
export * from './layout/Divider';
export * from './components/Button';
export * from './components/Input';
export * from './components/Card';
export * from './components/BubblePrimitive';
// More exports to follow
,

  'src/theme/ThemeProvider.tsx': import React from 'react';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="light bg-background text-foreground min-h-screen">{children}</div>;
};,

  'src/layout/Container.tsx': import React from 'react';

export const Container = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return <div className={\max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 \\}>{children}</div>;
};,

  'src/layout/Stack.tsx': import React from 'react';

export const Stack = ({ children, className = '', direction = 'col', gap = 4 }: { children: React.ReactNode, className?: string, direction?: 'row' | 'col', gap?: number }) => {
  return <div className={\lex flex-\ gap-\ \\}>{children}</div>;
};,

  'src/layout/Grid.tsx': import React from 'react';

export const Grid = ({ children, className = '', cols = 1 }: { children: React.ReactNode, className?: string, cols?: number }) => {
  return <div className={\grid grid-cols-\ gap-4 \\}>{children}</div>;
};,

  'src/layout/Spacer.tsx': import React from 'react';

export const Spacer = ({ size = 4 }: { size?: number }) => {
  return <div className={\h-\ w-\\} aria-hidden="true" />;
};,

  'src/layout/Divider.tsx': import React from 'react';

export const Divider = ({ className = '' }: { className?: string }) => {
  return <hr className={\order-t border-glass-border my-4 \\} />;
};,

  'src/components/Button.tsx': import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, variant = 'primary', className = '', ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-button px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-foreground hover:bg-secondary/80",
    glass: "backdrop-blur-glass bg-glass-background border border-glass-border text-foreground hover:bg-glass-background/80 shadow-glass"
  };
  
  return (
    <button ref={ref} className={\\ \ \\} {...props}>
      {children}
    </button>
  );
});
Button.displayName = 'Button';,

  'src/components/Input.tsx': import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
  return (
    <input 
      ref={ref}
      className={\lex h-10 w-full rounded-md border border-glass-border bg-glass-background px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 \\}
      {...props}
    />
  );
});
Input.displayName = 'Input';,

  'src/components/Card.tsx': import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={\ounded-xl border border-glass-border bg-glass-background backdrop-blur-glass shadow-glass overflow-hidden \\}>
      {children}
    </div>
  );
};,

  'src/components/BubblePrimitive.tsx': import React from 'react';

export const BubblePrimitive = ({ className = '' }: { className?: string }) => {
  return (
    <div className={\ounded-full border border-glass-border bg-glass-background backdrop-blur-glass shadow-glass \\}>
      {/* 2D Fallback for Bubble */}
    </div>
  );
};
};

Object.keys(files).forEach(file => {
  const fullPath = path.join(uiDir, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, files[file]);
});

console.log("UI Components scaffolded.");
