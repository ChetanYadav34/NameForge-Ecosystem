import React from 'react';
import { Container, Badge } from '@lexforge/ui';
import Link from 'next/link';
import { landingConfig, FooterColumn } from './config';

export const Footer = () => {
  return (
    <footer className="w-full py-16 bg-slate-950 text-slate-400 border-t border-slate-900 relative z-10">
      <Container className="flex flex-col gap-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="block font-serif text-2xl font-bold text-white tracking-tight mb-4 hover:opacity-90 transition-opacity">
              LexForge
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">
              The premier algorithmic branding and linguistic generation engine.
            </p>
          </div>
          
          {(landingConfig.footerLinks as FooterColumn[]).map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm">{column.title}</h4>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('http') ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors duration-200">
                        {link.label}
                      </a>
                    ) : link.comingSoon ? (
                      <span className="text-sm text-slate-600 flex items-center gap-2 cursor-not-allowed">
                        {link.label}
                        <Badge variant="default" className="text-[10px] py-0 px-1 border-slate-700 text-slate-500">Soon</Badge>
                      </span>
                    ) : (
                      <Link href={link.href} className="text-sm hover:text-white transition-colors duration-200">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} LexForge Computational Linguistics Institute. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/status" className="hover:text-white transition-colors">System Status</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
