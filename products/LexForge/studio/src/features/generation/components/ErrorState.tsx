import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 border border-destructive/20 bg-destructive/10 rounded-lg">
      <AlertCircle className="w-8 h-8 text-destructive" />
      <div className="text-center">
        <h3 className="font-medium text-destructive">Something went wrong</h3>
        <p className="text-sm text-destructive/80 mt-1">{error.message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-background text-foreground border rounded-md hover:bg-muted transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
