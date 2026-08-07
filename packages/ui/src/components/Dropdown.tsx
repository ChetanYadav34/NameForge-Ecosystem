import React, { useState, useRef, useEffect } from 'react';

export const Dropdown = ({ trigger, children, className = '' }: { trigger: React.ReactNode, children: React.ReactNode, className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-glass-background backdrop-blur-glass border border-glass-border shadow-glass ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${className}`}>
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-glass-background/50 hover:text-primary transition-colors"
    >
      {children}
    </button>
  );
};
