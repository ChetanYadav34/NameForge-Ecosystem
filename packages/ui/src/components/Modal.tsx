import React from 'react';

export const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true" />
      <div className="relative transform overflow-hidden rounded-xl bg-glass-background backdrop-blur-glass border border-glass-border px-4 pb-4 pt-5 text-left shadow-glass transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
        {children}
      </div>
    </div>
  );
};
