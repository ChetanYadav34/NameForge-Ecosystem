import React from 'react';

export const Toast = ({ title, description, variant = 'default', onClose }: { title: string, description?: string, variant?: 'default' | 'success' | 'error', onClose?: () => void }) => {
  const variants = {
    default: 'border-glass-border bg-glass-background text-foreground',
    success: 'border-green-500/50 bg-green-500/10 text-green-700',
    error: 'border-red-500/50 bg-red-500/10 text-red-700'
  };

  return (
    <div className={`pointer-events-auto flex w-full max-w-md rounded-lg shadow-glass border backdrop-blur-glass p-4 ${variants[variant]}`}>
      <div className="flex w-0 flex-1 justify-between">
        <div className="w-0 flex-1">
          <p className="text-sm font-medium">{title}</p>
          {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
        </div>
      </div>
      {onClose && (
        <div className="ml-4 flex flex-shrink-0">
          <button onClick={onClose} className="inline-flex rounded-md text-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};
