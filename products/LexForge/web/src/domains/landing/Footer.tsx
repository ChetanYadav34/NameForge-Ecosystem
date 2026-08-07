import React from 'react';
import { Container } from '@lexforge/ui';

export const Footer = () => {
  return (
    <footer className="w-full py-12 bg-slate-950 text-white border-t border-slate-900 relative z-10">
      <Container className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-serif text-2xl font-bold text-white tracking-tight">
          LexForge
        </div>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Contact', 'Status', 'Changelog'].map((link) => (
            <a key={link} className="text-xs text-slate-400 hover:text-primary underline-offset-4 hover:underline transition-all duration-200 cursor-pointer">
              {link}
            </a>
          ))}
        </div>
        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} LexForge Computational Linguistics Institute. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};
